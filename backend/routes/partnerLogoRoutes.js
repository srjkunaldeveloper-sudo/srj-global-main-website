const express = require("express");
const router = express.Router();

const {
  getPartnerLogos,
  getAdminPartnerLogos,
  createPartnerLogo,
  updatePartnerLogo,
  togglePartnerLogo,
  reorderPartnerLogos,
  deletePartnerLogo
} = require("../controllers/partnerLogoController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  validateCreatePartnerLogo,
  validateUpdatePartnerLogo,
  validateIdParam
} = require("../middleware/validators");
const upload = require("../middleware/upload");

// Public API
router.get("/", getPartnerLogos);

// Admin-Protected APIs
router.get("/admin", verifyToken, isAdmin, getAdminPartnerLogos);
router.post("/", verifyToken, isAdmin, upload.single("logo"), validateCreatePartnerLogo, createPartnerLogo);
router.patch("/reorder", verifyToken, isAdmin, reorderPartnerLogos);
router.patch("/:id/toggle", validateIdParam, verifyToken, isAdmin, togglePartnerLogo);
router.put("/:id/toggle", validateIdParam, verifyToken, isAdmin, togglePartnerLogo);
router.put("/:id", validateIdParam, verifyToken, isAdmin, upload.single("logo"), validateUpdatePartnerLogo, updatePartnerLogo);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deletePartnerLogo);

module.exports = router;
