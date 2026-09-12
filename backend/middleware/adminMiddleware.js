exports.isAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "super_admin")) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin authorization required.",
    });
  }

  next();
};

exports.isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super Admin privileges required.",
    });
  }

  next();
};

