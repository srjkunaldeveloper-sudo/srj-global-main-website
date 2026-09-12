const express = require("express");
const router = express.Router();

const {
  getProcessSteps,
  getAdminProcessSteps,
  createProcessStep,
  updateProcessStep,
  toggleProcessStep,
  reorderProcessSteps,
  deleteProcessStep
} = require("../controllers/processStepController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  validateCreateProcessStep,
  validateUpdateProcessStep,
  validateIdParam
} = require("../middleware/validators");

// Public API
router.get("/", getProcessSteps);

// Admin-Protected APIs
router.get("/admin", verifyToken, isAdmin, getAdminProcessSteps);
router.post("/", verifyToken, isAdmin, validateCreateProcessStep, createProcessStep);
router.patch("/reorder", verifyToken, isAdmin, reorderProcessSteps);
router.patch("/:id/toggle", validateIdParam, verifyToken, isAdmin, toggleProcessStep);
router.put("/:id/toggle", validateIdParam, verifyToken, isAdmin, toggleProcessStep);
router.put("/:id", validateIdParam, verifyToken, isAdmin, validateUpdateProcessStep, updateProcessStep);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deleteProcessStep);

module.exports = router;
