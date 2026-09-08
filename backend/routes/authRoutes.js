const express = require("express");
const router = express.Router();

const { register, login, getUsers } = require("../controllers/authController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { validateRegister, validateLogin } = require("../middleware/validators");
const { loginLimiter, registerLimiter } = require("../config/rateLimits");

router.post("/register", registerLimiter, validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);

router.get("/users", verifyToken, isAdmin, getUsers);

module.exports = router;
