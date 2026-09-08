const express = require("express");
const router = express.Router();
const { getJobs, createJob, deleteJob, updateJob, applyJob, getApplications } = require("../controllers/jobController");
const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

router.get("/", getJobs);
router.post("/", verifyToken, isAdmin, createJob);
router.put("/:id", verifyToken, isAdmin, updateJob);
router.delete("/:id", verifyToken, isAdmin, deleteJob);
router.post("/apply", applyJob);
router.get("/applications", verifyToken, isAdmin, getApplications);

module.exports = router;
