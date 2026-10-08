const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

exports.createBlog = asyncHandler(async (req, res) => {
  const { 
    title, category, type, description, content, author,
    meta_title, meta_description, meta_keywords, tags,
    author_role, author_image, reading_time,
    aeo_summary, aeo_faqs, key_takeaways
  } = req.body;

  const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : req.body.image;
  
  let { slug } = req.body;
  if (!slug && title) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const [result] = await db.query(
    `INSERT INTO blogs
    (title, slug, image, category, type, description, content, author,
     meta_title, meta_description, meta_keywords, tags,
     author_role, author_image, reading_time,
     aeo_summary, aeo_faqs, key_takeaways)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      slug,
      image || null,
      category || "Technology",
      type || "Fresh Perspectives",
      description || null,
      content,
      author || "SRJ Global Technologies",
      meta_title || title,
      meta_description || description,
      meta_keywords || null,
      tags || null,
      author_role || "Principal Technical Architect",
      author_image || null,
      reading_time || null,
      aeo_summary || description,
      aeo_faqs || null,
      key_takeaways || null
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
  const [blog] = await db.query("SELECT * FROM blogs WHERE id=? OR slug=?", [
    req.params.id,
    req.params.id,
  ]);

  if (!blog || blog.length === 0) {
    return res.status(404).json({ message: "Blog not found" });
  }

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
  const { 
    title, category, type, description, content, author, slug,
    meta_title, meta_description, meta_keywords, tags,
    author_role, author_image, reading_time,
    aeo_summary, aeo_faqs, key_takeaways
  } = req.body;

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
         author = COALESCE(?, author),
         meta_title = COALESCE(?, meta_title),
         meta_description = COALESCE(?, meta_description),
         meta_keywords = COALESCE(?, meta_keywords),
         tags = COALESCE(?, tags),
         author_role = COALESCE(?, author_role),
         author_image = COALESCE(?, author_image),
         reading_time = COALESCE(?, reading_time),
         aeo_summary = COALESCE(?, aeo_summary),
         aeo_faqs = COALESCE(?, aeo_faqs),
         key_takeaways = COALESCE(?, key_takeaways)
     WHERE id = ?`,
    [
      title, 
      finalSlug, 
      image, 
      category, 
      type, 
      description, 
      content, 
      author,
      meta_title,
      meta_description,
      meta_keywords,
      tags,
      author_role,
      author_image,
      reading_time,
      aeo_summary,
      aeo_faqs,
      key_takeaways,
      req.params.id
    ]
  );

  res.json({
    success: true,
    message: "Blog Updated",
  });
});
