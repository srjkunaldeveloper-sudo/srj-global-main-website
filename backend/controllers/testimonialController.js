const fs = require("fs");
const path = require("path");
const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Helper function to safely delete locally stored upload images
const deleteLocalFile = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") return;
  try {
    if (imageUrl.includes("/uploads/")) {
      const filename = imageUrl.split("/uploads/").pop();
      if (filename) {
        const filePath = path.join(__dirname, "../uploads", filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
  } catch (err) {
    // Ignore deletion errors gracefully
  }
};

// Public API: Get active testimonials ordered by sort_order ASC, created_at DESC, id DESC
exports.getTestimonials = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC, id DESC"
  );
  res.json({
    success: true,
    testimonials: rows
  });
});

// Admin API: Get all testimonials (active & inactive)
exports.getAdminTestimonials = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC, id DESC"
  );
  res.json({
    success: true,
    testimonials: rows
  });
});

// Admin API: Create new testimonial
exports.createTestimonial = asyncHandler(async (req, res) => {
  const { quote, author, role, company, rating, sort_order, is_active } = req.body;
  const image = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : (req.body.image && req.body.image !== "null" && req.body.image !== "" ? req.body.image : null);

  const [result] = await db.query(
    `INSERT INTO testimonials (quote, author, role, company, rating, image, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      quote.trim(),
      author.trim(),
      role.trim(),
      company && company.trim() !== "" ? company.trim() : null,
      rating ? parseInt(rating, 10) : 5,
      image,
      is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : 1,
      sort_order ? parseInt(sort_order, 10) : 0
    ]
  );

  res.status(201).json({
    success: true,
    message: "Testimonial created successfully",
    id: result.insertId
  });
});

// Admin API: Update existing testimonial with correct update semantics & file cleanup
exports.updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM testimonials WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Testimonial not found", 404);
  }
  const existing = existingRows[0];

  const { quote, author, role, company, rating, sort_order, is_active } = req.body;

  // Determine updated field values
  const updatedQuote = quote !== undefined ? quote.trim() : existing.quote;
  const updatedAuthor = author !== undefined ? author.trim() : existing.author;
  const updatedRole = role !== undefined ? role.trim() : existing.role;

  let updatedCompany = existing.company;
  if (company !== undefined) {
    updatedCompany = company !== null && company.trim() !== "" ? company.trim() : null;
  }

  const updatedRating = rating !== undefined ? parseInt(rating, 10) : existing.rating;
  const updatedSortOrder = sort_order !== undefined ? parseInt(sort_order, 10) : existing.sort_order;
  const updatedIsActive = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : existing.is_active;

  let updatedImage = existing.image;
  if (req.file) {
    // New image uploaded -> delete old local image if replaced
    if (existing.image) {
      deleteLocalFile(existing.image);
    }
    updatedImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  } else if (req.body.image === "REMOVE" || req.body.image === "" || req.body.image === null) {
    // Image explicitly cleared/removed
    if (existing.image) {
      deleteLocalFile(existing.image);
    }
    updatedImage = null;
  } else if (req.body.image !== undefined) {
    updatedImage = req.body.image;
  }

  await db.query(
    `UPDATE testimonials 
     SET quote = ?, 
         author = ?, 
         role = ?, 
         company = ?, 
         rating = ?, 
         image = ?, 
         is_active = ?, 
         sort_order = ?
     WHERE id = ?`,
    [
      updatedQuote,
      updatedAuthor,
      updatedRole,
      updatedCompany,
      updatedRating,
      updatedImage,
      updatedIsActive,
      updatedSortOrder,
      id
    ]
  );

  res.json({
    success: true,
    message: "Testimonial updated successfully"
  });
});

// Admin API: Toggle active status
exports.toggleTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  const [existingRows] = await db.query("SELECT * FROM testimonials WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Testimonial not found", 404);
  }

  const activeStatus = is_active == 1 || is_active === "true" || is_active === true ? 1 : 0;

  await db.query("UPDATE testimonials SET is_active = ? WHERE id = ?", [
    activeStatus,
    id
  ]);

  res.json({
    success: true,
    message: "Testimonial status updated"
  });
});

// Admin API: Delete testimonial with file cleanup
exports.deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM testimonials WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Testimonial not found", 404);
  }
  const existing = existingRows[0];

  if (existing.image) {
    deleteLocalFile(existing.image);
  }

  await db.query("DELETE FROM testimonials WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "Testimonial deleted successfully"
  });
});
