const checkEmail = (email, users) => {
  for (let value in users) {
    if (users[value].email === email) {
      return users[value];
    }
  } return null;
};

const generateRandomString = () => {
  let random = Math.random().toString(36).slice(2);
  return random.slice(0, 6);
};

const loopInData = (urlDatabase, user_id) => {
  // console.log('urlDatabase: ', urlDatabase)
  // console.log('userId: ', user_id)
  let userUrls = {};
  for (let shortId in urlDatabase) {
    // const url = urlDatabase[shortId]
    if (urlDatabase[shortId].userID === user_id) {
      userUrls[shortId] = urlDatabase[shortId].longURL;
    }
  } //console.log(userUrls)
  return userUrls;
};
module.exports = { checkEmail, generateRandomString, loopInData };