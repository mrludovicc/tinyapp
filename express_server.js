const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const generateRandomString = () => {
  let random = Math.random().toString(36).slice(2);
  return random.slice(0,6);
}
generateRandomString()
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  //console.log(res)
  res.send("Hello!");
});

app.get('/urls', (req, res) => {
  const templateVars = { 
    urls: urlDatabase
  }
  //console.log(templateVars.urls)
  res.render('urls_index', templateVars )
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new")
 // console.log(urlDatabase[req.params.id])
})
app.post("/urls", (req, res) => {
  const random = generateRandomString()
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
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
});
app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  let newURL = req.body.updatedURL;
  if (!newURL.includes('http')){
    newURL = `http://${newURL}`
  }
  console.log(shortURL)
  urlDatabase[shortURL] = newURL;
  res.redirect("/urls")
});

app.get('/urls/:id', (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});