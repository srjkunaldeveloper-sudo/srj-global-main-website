const express = require("express");
const router = express.Router();

const {
  getTrustPoints,
  getAdminTrustPoints,
  createTrustPoint,
  updateTrustPoint,
  toggleTrustPoint,
  reorderTrustPoints,
  deleteTrustPoint
} = require("../controllers/trustPointController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  validateCreateTrustPoint,
  validateUpdateTrustPoint,
  validateIdParam
} = require("../middleware/validators");

// Public API
router.get("/", getTrustPoints);

// Admin-Protected APIs
router.get("/admin", verifyToken, isAdmin, getAdminTrustPoints);
router.post("/", verifyToken, isAdmin, validateCreateTrustPoint, createTrustPoint);
router.patch("/reorder", verifyToken, isAdmin, reorderTrustPoints);
router.patch("/:id/toggle", validateIdParam, verifyToken, isAdmin, toggleTrustPoint);
router.put("/:id/toggle", validateIdParam, verifyToken, isAdmin, toggleTrustPoint);
router.put("/:id", validateIdParam, verifyToken, isAdmin, validateUpdateTrustPoint, updateTrustPoint);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deleteTrustPoint);

module.exports = router;
