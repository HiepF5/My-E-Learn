const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

const SALT_ROUNDS = 10;

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
});

const register = async ({ username, email, password }) => {
  if (!username || !password) {
    const error = new Error("username and password are required");
    error.statusCode = 400;
    throw error;
  }

  const existingUsername = await userRepository.findByUsername(username);
  if (existingUsername) {
    const error = new Error("username already exists");
    error.statusCode = 409;
    throw error;
  }

  if (email) {
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      const error = new Error("email already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userRepository.createUser({ username, email, password_hash });

  return sanitizeUser(user);
};

const login = async ({ username, email, password }) => {
  if (!password || (!username && !email)) {
    const error = new Error("provide username or email and password");
    error.statusCode = 400;
    throw error;
  }

  const user = email
    ? await userRepository.findByEmail(email)
    : await userRepository.findByUsername(username);

  if (!user) {
    const error = new Error("invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    const error = new Error("invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: sanitizeUser(user),
  };
};

module.exports = {
  register,
  login,
};
