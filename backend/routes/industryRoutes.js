const express = require("express");
const router = express.Router();

const {
  getIndustries,
  getIndustryById,
  getAdminIndustries,
  createIndustry,
  updateIndustry,
  toggleIndustry,
  deleteIndustry
} = require("../controllers/industryController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  validateCreateIndustry,
  validateUpdateIndustry
} = require("../middleware/validators");

// Public Routes
router.get("/", getIndustries);
router.get("/admin", verifyToken, isAdmin, getAdminIndustries);
router.get("/:id", getIndustryById);

// Protected Admin CRUD Routes
router.post("/", verifyToken, isAdmin, validateCreateIndustry, createIndustry);
router.put("/:id/toggle", verifyToken, isAdmin, toggleIndustry);
router.put("/:id", verifyToken, isAdmin, validateUpdateIndustry, updateIndustry);
router.delete("/:id", verifyToken, isAdmin, deleteIndustry);

module.exports = router;

