const express = require("express");
const router = express.Router();

const {
  getFaqs,
  getAdminFaqs,
  createFaq,
  updateFaq,
  toggleFaq,
  deleteFaq
} = require("../controllers/faqController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { 
  validateCreateFaq, 
  validateUpdateFaq, 
  validateIdParam 
} = require("../middleware/validators");

// Public Route
router.get("/", getFaqs);

// Admin-Protected Routes
router.get("/admin", verifyToken, isAdmin, getAdminFaqs);
router.post("/", verifyToken, isAdmin, validateCreateFaq, createFaq);
router.put("/:id/toggle", validateIdParam, verifyToken, isAdmin, toggleFaq);
router.put("/:id", validateIdParam, verifyToken, isAdmin, validateUpdateFaq, updateFaq);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deleteFaq);

module.exports = router;
