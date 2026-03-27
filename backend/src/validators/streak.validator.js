const validateDaysQuery = (req, res, next) => {
  const { days } = req.query;
  if (days === undefined) return next();

  const value = Number(days);
  if (!Number.isInteger(value) || value < 7 || value > 365) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "days must be an integer between 7 and 365",
    });
  }

  return next();
};

module.exports = {
  validateDaysQuery,
};
