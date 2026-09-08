const express = require("express");
const router = express.Router();

const {
  createPromotion,
  getPromotions,
  getActivePromotion,
  togglePromotion,
  updatePromotion,
  deletePromotion
} = require("../controllers/promotionController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

// Public route to fetch active promotion banner
router.get("/active", getActivePromotion);

// Admin-protected routes
router.post("/", verifyToken, isAdmin, upload.single("image"), createPromotion);
router.get("/", verifyToken, isAdmin, getPromotions);
router.put("/:id/toggle", verifyToken, isAdmin, togglePromotion);
router.put("/:id", verifyToken, isAdmin, upload.single("image"), updatePromotion);
router.delete("/:id", verifyToken, isAdmin, deletePromotion);

module.exports = router;
