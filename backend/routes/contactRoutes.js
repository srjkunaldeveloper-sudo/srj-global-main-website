const express = require("express");
const router = express.Router();

const {
  createContact,
  getContacts,
  deleteContact,
} = require("../controllers/contactController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { validateCreateContact, validateIdParam } = require("../middleware/validators");
const { contactLimiter } = require("../config/rateLimits");

router.post("/", contactLimiter, validateCreateContact, createContact);

router.get("/", verifyToken, isAdmin, getContacts);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deleteContact);

module.exports = router;
