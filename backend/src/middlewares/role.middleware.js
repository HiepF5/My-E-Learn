/**
 * Role guard after auth.middleware. JWT should include `role` (USER | ADMIN).
 * Tokens issued before role migration: missing role treated as USER.
 */
const allowRole = (...allowedRoles) => (req, res, next) => {
  const role = req.user?.role || "USER";
  if (!allowedRoles.includes(role)) {
    return res.status(403).json({
      success: false,
      data: null,
      message: "Forbidden",
    });
  }
  return next();
};

module.exports = { allowRole };
