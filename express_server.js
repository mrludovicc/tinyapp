// -------------- DEPENDENCIES
const express = require("express");
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');
const methodOverride = require("method-override");
const { checkEmail, generateRandomString, loopInData } = require('./helpers');
const app = express();
const PORT = 8080;

// ------------ MIDDLEWARE
app.use(cookieSession({
  name: 'session',
  keys: ['235fgs', 'sef25', 'test', 'app', 'hello', 'world'],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// ------------ DATA
const { urlDatabase, users } = require("./data");


// -------------- GET REQUESTS

// Home page, will redirect you to login page if user is not logged
app.get("/", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.redirect("/login");
  }

  return res.redirect("/urls");
});

// The page where can we see our existing shortened URLs
app.get('/urls', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  const userUrls = loopInData(urlDatabase, user_id);

  if (!user_id) {
    return res.send("Please login or register first");
  }

  const templateVars = {
    user,
    urls: userUrls
  };
  return res.render('urls_index', templateVars);
});

// The page where we can short new URLs
app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];

  if (!user_id) {
    return res.redirect('/login');
  }
  const templateVars = {
    user,
  };
  return res.render("urls_new", templateVars);
});

// The page where you can see both short URL and the original
app.get('/urls/:id', (req, res) => {
  const shortUrl = req.params.id;
  const user_id = req.session.user_id;
  const user = users[user_id];
  const userUrls = loopInData(urlDatabase, user_id);

  if (!user_id) {
    return res.status(403).send("Cannot use a short URL when you are not logged in");
  }
  if (!urlDatabase[shortUrl]) {
    return res.status(404).send("URL does not exist!");
  }

  if (!userUrls[shortUrl]) {
    return res.status(403).send("URL does not belong to you!!!");
  }

  const templateVars = {
    id: shortUrl,
    userInfo: urlDatabase[shortUrl],
    user
  };
  return res.render("urls_show", templateVars);
});

// Redirect to the original longURL website
app.get("/u/:id", (req, res) => {
  const userInfo = urlDatabase[req.params.id];
  const originUrl = userInfo.longURL;

  if (!userInfo) {
    return res.send("The short URL does not exist!");
  }

  return res.redirect(originUrl);
});

// Render registration template
app.get('/register', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];

  if (user_id) {
    return res.redirect('/urls');
  }

  const templateVars = {
    user
  };
  return res.render("urls_register", templateVars);
});

// Renders login template
app.get('/login', (req, res) => {
  if (req.session.user_id) {
    return res.redirect('/urls');
  }
  const user_id = req.session.user_id;
  const user = users[user_id];
  const templateVars = {
    user
  };
  res.render("urls_login", templateVars);
});

// ------------ POST REQUESTS

// Take care of the submission form and generate the short URL
app.post("/urls", (req, res) => {
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.send("Cannot create a URL when you are not logged in");
  }

  const random = generateRandomString();
  urlDatabase[random] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };

  res.redirect(`/urls/${random}`);
});

// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = checkEmail(email, users);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user_id = user.id;
    return res.redirect('/urls');
  }
  return res.status(400).send('wrong credentials');
});

// Logout endpoint, clear cookies
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

// endpoint for registration that manages registration information
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Please enter valid a information");
  }
  const user = checkEmail(email, users);
  if (user) {
    return res.status(400).send("email exists");
  }
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email,
    password: bcrypt.hashSync(password, 10)
  };
  req.session.user_id = userId;
  res.redirect('/urls');
});

// ------------ DELETE & PUT REQUESTS

// Delete a URL
app.delete('/urls/:id/delete', (req, res) => {
  const user_id = req.session.user_id;
  const shortURL = req.params.id;
  if (user_id && user_id === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    return res.redirect("/urls");
  }
  res.send('Error not the owner of the URL');
});

// Update or edit a URL
app.put('/urls/:id', (req, res) => {
  const user_id = req.session.user_id;
  const shortURL = req.params.id;
  if (user_id && user_id === urlDatabase[shortURL].userID) {
    const newURL = req.body.updatedURL;
    if (!newURL.includes('http')) {
      newURL = `http://${newURL}`;
    }
    urlDatabase[shortURL] = {
      longURL: newURL,
      userID: user_id
    };
    return res.redirect("/urls");
  }
  res.send("Error not the owner of the URL");
});

// ---------- LISTENING PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});