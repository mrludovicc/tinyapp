const { assert } = require('chai');

const { checkEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('checkEmail', function () {
  it('should return a user with valid email', function () {
    const user = checkEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID)
  });

  it('should return undefined when providing a email not exist', function () {
    const user = checkEmail("test@test.LHL.com", testUsers)
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID)
  });
});