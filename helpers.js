/**
 * Function that takes in users email, and loops through database to find if its already stored
 *
 * @param {string} email
 * @param {object} user
 * @returns {object}
 */
const checkEmail = (email, users) => {
  for (let value in users) {
    if (users[value].email === email) {
      return users[value];
    }
  } return null;
};

/**
 * Function that returns 6 random alphanumeric characters
 * @returns {string}
 */
const generateRandomString = () => {
  let random = Math.random().toString(36).slice(2);
  return random.slice(0, 6);
};

/**
 * Function that return a shortURL if it belongs to the user requesting it
 *
 * @param {string} userID
 * @param {object} urlDatabase
 * @returns {object}
 */
const loopInData = (urlDatabase, user_id) => {

  let userUrls = {};
  for (let shortId in urlDatabase) {
    if (urlDatabase[shortId].userID === user_id) {
      userUrls[shortId] = urlDatabase[shortId].longURL;
    }
  }
  return userUrls;
};
module.exports = { checkEmail, generateRandomString, loopInData };