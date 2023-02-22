const express = require("express");
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const generateRandomString = () => {
  let random = Math.random().toString(36).slice(2);
  return random.slice(0, 6);
};
// for(let value of users){
//   value.email ===
// }
generateRandomString();
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  //console.log(res)
  res.send("Hello!");
});

app.get('/urls', (req, res) => {
  const user_id = req.cookies['user_id']
  const user = users[user_id]
  const templateVars = {
    user,
    urls: urlDatabase
  };
  //console.log(templateVars.urls)
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
  // console.log(urlDatabase[req.params.id])
});
app.post("/urls", (req, res) => {
  const random = generateRandomString();
  urlDatabase[random] = req.body.longURL;
  //console.log('verify long url:', req.body.longURL); // Log the POST request body to the console
  res.redirect(`/urls/${random}`);
});

app.get("/u/:id", (req, res) => {

  const longURL = urlDatabase[req.params.id];
  //console.log('req: ', urlDatabase[req.params.id])
  res.redirect(longURL);
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});
app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  let newURL = req.body.updatedURL;
  if (!newURL.includes('http')) {
    newURL = `http://${newURL}`;
  }
  // console.log(shortURL);
  urlDatabase[shortURL] = newURL;
  res.redirect("/urls");
});
app.post('/login', (req, res) => {
  // const value = users;
  const { email, password } = req.body
  //console.log(value)
  res.cookie('user_id', email);
  res.redirect('/urls');

});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.get('/urls/:id', (req, res) => {
  const user_id = req.cookies['user_id']
  const user = users[user_id]
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user
    // username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get('/register', (req, res) => {
  const user_id = req.cookies['user_id']
  const user = users[user_id]
  const templateVars = {
    user
  };
  res.render("urls_register", templateVars);
})

app.post("/register", (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send("Please enter valid a information")
  }
  const checkEmail = () => {
    for (let value in users) {
      console.log(users[value].email)
      if (users[value].email === req.body.email) {
        return res.status(400).send("email is exist, please try different email")
      }
    }
  }
  checkEmail();
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  }
  res.cookie('user_id', userId)
  res.redirect('/urls')
  console.log(users);
})

app.get('/login', (req, res) => {
  const user_id = req.cookies['user_id']
  const user = users[user_id]
  const templateVars = {
    user
  };
  res.render("urls_login", templateVars);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});