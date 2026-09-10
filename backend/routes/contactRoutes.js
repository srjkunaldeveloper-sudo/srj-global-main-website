const express = require("express");
const router = express.Router();

const {
  createContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contactController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  validateCreateContact,
  validateUpdateContactStatus,
  validateIdParam,
} = require("../middleware/validators");
const { contactLimiter } = require("../config/rateLimits");

router.post("/", contactLimiter, validateCreateContact, createContact);

router.get("/", verifyToken, isAdmin, getContacts);
router.put("/:id/status", validateIdParam, verifyToken, isAdmin, validateUpdateContactStatus, updateContactStatus);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deleteContact);

module.exports = router;
