const bcrypt = require('bcryptjs')
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

const password = 'purple-monkey-dinosaur'
const hashedPassword = bcrypt.hashSync(password, 10)
console.log(hashedPassword)