const express = require("express");
const router = express.Router();

const {
  getPortfolio,
  getAdminPortfolio,
  createPortfolio,
  updatePortfolio,
  togglePortfolio,
  deletePortfolio
} = require("../controllers/portfolioController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { 
  validateCreatePortfolio, 
  validateUpdatePortfolio, 
  validateIdParam 
} = require("../middleware/validators");
const upload = require("../middleware/upload");

// Public Route
router.get("/", getPortfolio);

// Admin-Protected Routes
router.get("/admin", verifyToken, isAdmin, getAdminPortfolio);
router.post("/", verifyToken, isAdmin, upload.single("image"), validateCreatePortfolio, createPortfolio);
router.put("/:id/toggle", validateIdParam, verifyToken, isAdmin, togglePortfolio);
router.put("/:id", validateIdParam, verifyToken, isAdmin, upload.single("image"), validateUpdatePortfolio, updatePortfolio);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deletePortfolio);

module.exports = router;
