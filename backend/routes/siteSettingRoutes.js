const express = require("express");
const router = express.Router();

const {
  getPublicSettings,
  getAdminSettings,
  updateSettingByKey,
  updateBulkSettings,
} = require("../controllers/siteSettingController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  validateUpdateSettingKey,
  validateBulkUpdateSettings,
} = require("../middleware/validators");

// Public API: Safe-read site settings
router.get("/", getPublicSettings);

// Admin API: Protected read full settings metadata
router.get("/admin", verifyToken, isAdmin, getAdminSettings);

// Admin API: Protected bulk update settings
router.put("/", verifyToken, isAdmin, validateBulkUpdateSettings, updateBulkSettings);
router.put("/bulk", verifyToken, isAdmin, validateBulkUpdateSettings, updateBulkSettings);

// Admin API: Protected update single setting by key
router.put("/:key", validateUpdateSettingKey, verifyToken, isAdmin, updateSettingByKey);

module.exports = router;
