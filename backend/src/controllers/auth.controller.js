const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      data: user,
      message: "User registered",
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      data,
      message: "Login successful",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
};
