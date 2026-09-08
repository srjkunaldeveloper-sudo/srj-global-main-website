const express = require("express");
const router = express.Router();

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { validateCreateService, validateIdParam } = require("../middleware/validators");
const upload = require("../middleware/upload");

router.post("/", verifyToken, isAdmin, upload.single("image"), validateCreateService, createService);
router.get("/", getServices);
router.get("/:id", validateIdParam, getServiceById);
router.put("/:id", validateIdParam, verifyToken, isAdmin, upload.single("image"), updateService);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deleteService);

module.exports = router;
