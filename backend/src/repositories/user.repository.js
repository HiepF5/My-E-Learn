const User = require("../models/user.model");

const findByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

const findByUsername = async (username) => {
  return User.findOne({ where: { username } });
};

const createUser = async ({ username, email, password_hash }) => {
  return User.create({ username, email, password_hash });
};

module.exports = {
  findByEmail,
  findByUsername,
  createUser,
};
