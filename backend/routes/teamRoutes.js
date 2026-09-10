const express = require("express");
const router = express.Router();

const {
  getTeamMembers,
  getTeamMemberById,
  getAdminTeamMembers,
  createTeamMember,
  updateTeamMember,
  toggleTeamMember,
  deleteTeamMember
} = require("../controllers/teamController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  validateCreateTeam,
  validateUpdateTeam,
  validateIdParam
} = require("../middleware/validators");
const upload = require("../middleware/upload");

// Public Routes
router.get("/", getTeamMembers);
router.get("/admin", verifyToken, isAdmin, getAdminTeamMembers);
router.get("/:id", validateIdParam, getTeamMemberById);

// Protected Admin Routes
router.post("/", verifyToken, isAdmin, upload.single("image"), validateCreateTeam, createTeamMember);
router.put("/:id/toggle", validateIdParam, verifyToken, isAdmin, toggleTeamMember);
router.put("/:id", validateIdParam, verifyToken, isAdmin, upload.single("image"), validateUpdateTeam, updateTeamMember);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deleteTeamMember);

module.exports = router;
