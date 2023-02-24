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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const loopInData = (urlDatabase, user_id) => {
  // console.log('urlDatabase: ', urlDatabase)
  // console.log('userId: ', user_id)
  let userUrls = {};
  for (let shortId in urlDatabase) {
    // const url = urlDatabase[shortId]
    if (urlDatabase[shortId].userID === user_id) {
      userUrls[shortId] = urlDatabase[shortId].longURL
    }
  } //console.log(userUrls)
  return userUrls;
}

app.get("/", (req, res) => {
  //console.log(res)
  res.send("Hello!");
});

app.get('/urls', (req, res) => {
  if (!req.cookies.user_id) {
    return res.send("Please login or register first");
  }
  const user_id = req.cookies['user_id']
  //console.log('userID: ', user_id)
  const user = users[user_id]
  //console.log('user: ', user)
  // const userUrls = {};
  const userUrls = loopInData(urlDatabase, user_id)
  //console.log(userUrls)

  const templateVars = {
    user,
    urls: userUrls
  };
  //console.log(templateVars.urls)
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies.user_id) {
    return res.redirect('/login')
  }
  const user_id = req.cookies['user_id']
  // console.log(userUrls)
  const user = users[user_id]
  const templateVars = {
    user,
  }
  res.render("urls_new", templateVars);
  // console.log(urlDatabase[req.params.id])
});
app.post("/urls", (req, res) => {
  if (!req.cookies.user_id) {
    return res.send("cannot create a URL when you are not logged in");
  }
  const random = generateRandomString();
  //console.log(req.body)
  urlDatabase[random] = {
    longURL: req.body.longURL,
    userID: req.cookies.user_id
  };
  //console.log('verify long url:', req.body.longURL); // Log the POST request body to the console
  res.redirect(`/urls/${random}`);
});

app.get("/u/:id", (req, res) => {

  if (!urlDatabase[req.params.id]) {
    return res.send("The short URL does not exist!")
  }
  const userInfo = urlDatabase[req.params.id];
  const originUrl = userInfo.longURL
  //console.log('req: ', urlDatabase[req.params.id])
  res.redirect(originUrl);
});

app.post('/urls/:id/delete', (req, res) => {
  if (req.cookies.user_id && req.cookies.user_id === urlDatabase[req.params.id].userID) {
    delete urlDatabase[req.params.id];
    return res.redirect("/urls");
  }
  res.send('Error not the owner of the URL')

});

app.post('/urls/:id', (req, res) => {
  if (req.cookies.user_id && req.cookies.user_id === urlDatabase[req.params.id].userID) {
    const shortURL = req.params.id;
    let newURL = req.body.updatedURL;
    if (!newURL.includes('http')) {
      newURL = `http://${newURL}`;
    }
    urlDatabase[shortURL] = { longURL: newURL, userID: req.cookies.user_id };
    // console.log(urlDatabase)
    // console.log(urlDatabase[shortURL])
    // console.log(shortURL)
    res.redirect("/urls");
  }
  res.send("Error not the owner of the URL")
});

app.post('/login', (req, res) => {
  //console.log(req.cookies.user_id)
  const { email, password } = req.body
  //console.log(value)
  const user = checkEmail(email);

  if (user && user.password === password) {
    res.cookie('user_id', user.id);
    return res.redirect('/urls');
  }
  return res.status(400).send('wrong credentials')

});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

app.get('/urls/:id', (req, res) => {
  if (!req.cookies.user_id) {
    return res.send("cannot use a short URL when you are not logged in");
  }
  const user_id = req.cookies['user_id']
  const user = users[user_id]
  const templateVars = {
    id: req.params.id,
    userInfo: urlDatabase[req.params.id],
    user
    // username: req.cookies["username"]
  };
  // console.log(templateVars.userInfo.longURL)
  // console.log(templateVars.userInfo)
  res.render("urls_show", templateVars);
});

app.get('/register', (req, res) => {
  if (req.cookies.user_id) {
    return res.redirect('/urls')
  }
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
  const user = checkEmail(req.body.email)
  if (user) {
    return res.status(400).send("email exists")
  }
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  }
  res.cookie('user_id', userId)
  res.redirect('/urls')
  // console.log(users);
})

app.get('/login', (req, res) => {
  if (req.cookies.user_id) {
    return res.redirect('/urls')
  }
  const user_id = req.cookies['user_id']
  const user = users[user_id]
  const templateVars = {
    user
  };
  res.render("urls_login", templateVars);
})

const checkEmail = (email) => {
  for (let value in users) {
    if (users[value].email === email) {
      return users[value]
    }
  } return null
}
// const loopInData = () => {
//   // const userUrls = {};
//   for (let shortId in urlDatabase) {
//     const url = urlDatabase[shortId]
//     if (user_id === url.userID) {
//       return true;
//       // userUrls[shortId] = url
//       // console.log(userUrls)
//       // console.log(userUrls[shortId])
//       // console.log(url.longURL)
//     } return false;
//   }
// }
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});