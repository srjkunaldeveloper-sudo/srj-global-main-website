const express = require("express");
const router = express.Router();

const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { validateCreateBlog, validateIdParam } = require("../middleware/validators");
const upload = require("../middleware/upload");

router.post("/", verifyToken, isAdmin, upload.single("image"), validateCreateBlog, createBlog);
router.get("/", getBlogs);
router.get("/:id", validateIdParam, getBlogById);
router.put("/:id", validateIdParam, verifyToken, isAdmin, upload.single("image"), updateBlog);
router.delete("/:id", validateIdParam, verifyToken, isAdmin, deleteBlog);

module.exports = router;
