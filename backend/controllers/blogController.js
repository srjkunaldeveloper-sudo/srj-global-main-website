const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

exports.createBlog = asyncHandler(async (req, res) => {
  const { title, category, type, description, content, author } = req.body;
  const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : req.body.image;
  
  let { slug } = req.body;
  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const [result] = await db.query(
    `INSERT INTO blogs
    (title, slug, image, category, type, description, content, author)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      slug,
      image,
      category,
      type || "Fresh Perspectives",
      description,
      content,
      author || "SRJ Global Softech",
    ],
  );

  res.status(201).json({
    success: true,
    id: result.insertId,
  });
});

exports.getBlogs = asyncHandler(async (req, res) => {
  const [blogs] = await db.query(
    "SELECT * FROM blogs ORDER BY created_at DESC",
  );

  res.json(blogs);
});

exports.getBlogById = asyncHandler(async (req, res) => {
  const [blog] = await db.query("SELECT * FROM blogs WHERE id=?", [
    req.params.id,
  ]);

  res.json(blog[0]);
});

exports.deleteBlog = asyncHandler(async (req, res) => {
  await db.query("DELETE FROM blogs WHERE id=?", [req.params.id]);

  res.json({
    success: true,
    message: "Blog Deleted",
  });
});

exports.updateBlog = asyncHandler(async (req, res) => {
  const { title, category, type, description, content, author, slug } = req.body;
  const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : req.body.image;

  let finalSlug = slug;
  if (!finalSlug && title) {
    finalSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  await db.query(
    `UPDATE blogs 
     SET title = COALESCE(?, title), 
         slug = COALESCE(?, slug), 
         image = COALESCE(?, image), 
         category = COALESCE(?, category), 
         type = COALESCE(?, type), 
         description = COALESCE(?, description), 
         content = COALESCE(?, content), 
         author = COALESCE(?, author)
     WHERE id = ?`,
    [title, finalSlug, image, category, type, description, content, author, req.params.id]
  );

  res.json({
    success: true,
    message: "Blog Updated",
  });
});
