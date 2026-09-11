const express = require("express");
const router = express.Router();

const {
  getPublicNavigation,
  getAdminNavigation,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  toggleNavigationItem,
  reorderNavigationItems,
} = require("../controllers/navigationController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  validateGetNavigationQuery,
  validateCreateNavigation,
  validateUpdateNavigation,
  validateReorderNavigation,
  validateIdParam,
} = require("../middleware/validators");

// Public API
router.get("/", validateGetNavigationQuery, getPublicNavigation);

// Protected Admin API
router.get("/admin", verifyToken, isAdmin, getAdminNavigation);

router.post("/", verifyToken, isAdmin, validateCreateNavigation, createNavigationItem);

// Static reorder routes must come BEFORE parameterized /:id routes
router.patch("/reorder", verifyToken, isAdmin, validateReorderNavigation, reorderNavigationItems);
router.put("/reorder", verifyToken, isAdmin, validateReorderNavigation, reorderNavigationItems);

// Toggle state
router.patch("/:id/toggle", validateIdParam, verifyToken, isAdmin, toggleNavigationItem);
router.put("/:id/toggle", validateIdParam, verifyToken, isAdmin, toggleNavigationItem);

// Parameterized item routes
router.put("/:id", validateIdParam, verifyToken, isAdmin, validateUpdateNavigation, updateNavigationItem);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deleteNavigationItem);

module.exports = router;
