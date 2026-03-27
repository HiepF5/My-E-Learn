const validateWeakWordsQuery = (req, res, next) => {
  const { limit } = req.query;
  if (limit === undefined) return next();

  const n = Number(limit);
  if (!Number.isInteger(n) || n < 1 || n > 100) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "limit must be an integer between 1 and 100",
    });
  }
  return next();
};

module.exports = {
  validateWeakWordsQuery,
};
