const express = require("express");
const router = express.Router();

const {
  getTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  toggleTestimonial,
  deleteTestimonial
} = require("../controllers/testimonialController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { validateCreateTestimonial, validateIdParam } = require("../middleware/validators");
const upload = require("../middleware/upload");

// Public API
router.get("/", getTestimonials);

// Admin-Protected APIs
router.get("/admin", verifyToken, isAdmin, getAdminTestimonials);
router.post("/", verifyToken, isAdmin, upload.single("image"), validateCreateTestimonial, createTestimonial);
router.put("/:id/toggle", validateIdParam, verifyToken, isAdmin, toggleTestimonial);
router.put("/:id", validateIdParam, verifyToken, isAdmin, upload.single("image"), updateTestimonial);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deleteTestimonial);

module.exports = router;
