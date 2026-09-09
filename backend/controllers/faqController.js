const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Public API: Get active FAQs (is_active = 1) ordered by sort_order ASC, created_at DESC, id DESC
// Supports optional category filter via req.query.category
exports.getFaqs = asyncHandler(async (req, res) => {
  const { category } = req.query;
  let query = "SELECT * FROM faqs WHERE is_active = 1";
  const queryParams = [];

  if (category && typeof category === "string" && category.trim() !== "") {
    query += " AND category = ?";
    queryParams.push(category.trim());
  }

  query += " ORDER BY sort_order ASC, created_at DESC, id DESC";

  const [rows] = await db.query(query, queryParams);
  res.json({
    success: true,
    faqs: rows
  });
});

// Admin API: Get all FAQs (active & inactive)
exports.getAdminFaqs = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM faqs ORDER BY sort_order ASC, created_at DESC, id DESC"
  );
  res.json({
    success: true,
    faqs: rows
  });
});

// Admin API: Create a new FAQ
exports.createFaq = asyncHandler(async (req, res) => {
  const { question, answer, category, sort_order, is_active } = req.body;

  const trimmedQuestion = question.trim();
  const trimmedAnswer = answer.trim();
  const cat = category && typeof category === "string" && category.trim() !== "" ? category.trim() : "General";
  const activeStatus = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : 1;
  const order = sort_order !== undefined ? parseInt(sort_order, 10) : 0;

  const [result] = await db.query(
    `INSERT INTO faqs (question, answer, category, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?)`,
    [trimmedQuestion, trimmedAnswer, cat, activeStatus, order]
  );

  res.status(201).json({
    success: true,
    message: "FAQ created successfully",
    id: result.insertId
  });
});

// Admin API: Update existing FAQ with partial update semantics
exports.updateFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM faqs WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("FAQ not found", 404);
  }
  const existing = existingRows[0];

  const { question, answer, category, sort_order, is_active } = req.body;

  const updatedQuestion = question !== undefined ? question.trim() : existing.question;
  const updatedAnswer = answer !== undefined ? answer.trim() : existing.answer;
  const updatedCategory = category !== undefined ? (category !== null && category.trim() !== "" ? category.trim() : "General") : existing.category;
  const updatedSortOrder = sort_order !== undefined ? parseInt(sort_order, 10) : existing.sort_order;
  const updatedIsActive = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : existing.is_active;

  await db.query(
    `UPDATE faqs 
     SET question = ?, answer = ?, category = ?, sort_order = ?, is_active = ?
     WHERE id = ?`,
    [updatedQuestion, updatedAnswer, updatedCategory, updatedSortOrder, updatedIsActive, id]
  );

  res.json({
    success: true,
    message: "FAQ updated successfully"
  });
});

// Admin API: Toggle active status of an FAQ (1 -> 0 or 0 -> 1)
exports.toggleFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM faqs WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("FAQ not found", 404);
  }
  const existing = existingRows[0];

  const newStatus = existing.is_active === 1 ? 0 : 1;

  await db.query("UPDATE faqs SET is_active = ? WHERE id = ?", [newStatus, id]);

  res.json({
    success: true,
    message: "FAQ status updated successfully",
    is_active: newStatus
  });
});

// Admin API: Permanently delete an FAQ
exports.deleteFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM faqs WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("FAQ not found", 404);
  }

  await db.query("DELETE FROM faqs WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "FAQ deleted successfully"
  });
});
