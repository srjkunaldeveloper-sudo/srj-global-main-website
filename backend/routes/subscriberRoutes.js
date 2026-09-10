const express = require("express");
const router = express.Router();

const {
  subscribe,
  getAdminSubscribers,
  toggleSubscriberStatus,
  deleteSubscriber
} = require("../controllers/subscriberController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  validateSubscribe,
  validateIdParam
} = require("../middleware/validators");

// Public Route
router.post("/", validateSubscribe, subscribe);

// Protected Admin Routes
router.get("/admin", verifyToken, isAdmin, getAdminSubscribers);
router.put("/:id/toggle", validateIdParam, verifyToken, isAdmin, toggleSubscriberStatus);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deleteSubscriber);

module.exports = router;
