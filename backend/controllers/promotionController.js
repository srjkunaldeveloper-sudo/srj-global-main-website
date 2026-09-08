const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

// Create promotion
exports.createPromotion = asyncHandler(async (req, res) => {
  const { title, description, cta_text, cta_link } = req.body;
  const image_url = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : (req.body.image_url || null);

  const [result] = await db.query(
    `INSERT INTO promotions (title, description, cta_text, cta_link, image_url, is_active)
     VALUES (?, ?, ?, ?, ?, 0)`,
    [title, description, cta_text || 'Learn More', cta_link, image_url]
  );

  res.status(201).json({
    success: true,
    message: "Promotion created successfully",
    id: result.insertId
  });
});

// Fetch all promotions (admin)
exports.getPromotions = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM promotions ORDER BY id DESC");
  res.json({
    success: true,
    promotions: rows
  });
});

// Fetch currently active promotion (public)
exports.getActivePromotion = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM promotions WHERE is_active = 1 LIMIT 1");
  res.json({
    success: true,
    promotion: rows[0] || null
  });
});

// Toggle active status (Only 1 active promotion at a time)
exports.togglePromotion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  if (is_active) {
    // Deactivate all first
    await db.query("UPDATE promotions SET is_active = 0");
    // Activate target
    await db.query("UPDATE promotions SET is_active = 1 WHERE id = ?", [id]);
  } else {
    // Just deactivate target
    await db.query("UPDATE promotions SET is_active = 0 WHERE id = ?", [id]);
  }

  res.json({
    success: true,
    message: "Promotion status updated successfully"
  });
});

// Update promotion details
exports.updatePromotion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, cta_text, cta_link } = req.body;
  const image_url = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : req.body.image_url;

  await db.query(
    `UPDATE promotions 
     SET title = ?, description = ?, cta_text = ?, cta_link = ?, image_url = ?
     WHERE id = ?`,
    [title, description, cta_text || 'Learn More', cta_link, image_url, id]
  );

  res.json({
    success: true,
    message: "Promotion updated successfully"
  });
});

// Delete promotion
exports.deletePromotion = asyncHandler(async (req, res) => {
  await db.query("DELETE FROM promotions WHERE id = ?", [req.params.id]);
  res.json({
    success: true,
    message: "Promotion deleted successfully"
  });
});
