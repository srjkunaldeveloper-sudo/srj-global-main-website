const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUsers,
  forgotPassword,
  resetPassword,
  getAdminUsers,
  createAdmin,
  superAdminResetPassword,
  toggleAdminStatus,
  deleteAdmin,
  updateAdminRole,
} = require("../controllers/authController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin, isSuperAdmin } = require("../middleware/adminMiddleware");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateCreateAdmin,
  validateIdParam,
} = require("../middleware/validators");
const { loginLimiter, registerLimiter } = require("../config/rateLimits");

// Public Auth Endpoints
router.post("/register", registerLimiter, validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", validateResetPassword, resetPassword);

// General Admin / Super Admin Read
router.get("/users", verifyToken, isAdmin, getUsers);

// Exclusive Super Admin User Management Endpoints
router.get("/admins", verifyToken, isSuperAdmin, getAdminUsers);
router.post("/create-admin", verifyToken, isSuperAdmin, validateCreateAdmin, createAdmin);
router.post("/reset-admin-password", verifyToken, isSuperAdmin, superAdminResetPassword);
router.put("/admins/:id/role", verifyToken, isSuperAdmin, validateIdParam, updateAdminRole);
router.put("/admins/:id/toggle", verifyToken, isSuperAdmin, validateIdParam, toggleAdminStatus);
router.delete("/admins/:id", verifyToken, isSuperAdmin, validateIdParam, deleteAdmin);

module.exports = router;
