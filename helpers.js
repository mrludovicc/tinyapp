const checkEmail = (email, users) => {
  for (let value in users) {
    if (users[value].email === email) {
      return users[value]
    }
  } return null
}

module.exports = { checkEmail }