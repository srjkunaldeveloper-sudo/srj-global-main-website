const express = require("express");
const router = express.Router();

const {
  getCompanyStats,
  getAdminCompanyStats,
  createCompanyStat,
  updateCompanyStat,
  toggleCompanyStat,
  reorderCompanyStats,
  deleteCompanyStat
} = require("../controllers/companyStatsController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  validateCreateCompanyStat,
  validateUpdateCompanyStat,
  validateIdParam
} = require("../middleware/validators");

// Public API
router.get("/", getCompanyStats);

// Admin-Protected APIs
router.get("/admin", verifyToken, isAdmin, getAdminCompanyStats);
router.post("/", verifyToken, isAdmin, validateCreateCompanyStat, createCompanyStat);
router.patch("/reorder", verifyToken, isAdmin, reorderCompanyStats);
router.patch("/:id/toggle", validateIdParam, verifyToken, isAdmin, toggleCompanyStat);
router.put("/:id/toggle", validateIdParam, verifyToken, isAdmin, toggleCompanyStat);
router.put("/:id", validateIdParam, verifyToken, isAdmin, validateUpdateCompanyStat, updateCompanyStat);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deleteCompanyStat);

module.exports = router;
