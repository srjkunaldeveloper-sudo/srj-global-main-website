const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Public API: Get active process steps ordered by sort_order ASC, id ASC
exports.getProcessSteps = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, title, description, icon_name, sort_order, is_active FROM process_steps WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
  );
  res.json({
    success: true,
    count: rows.length,
    steps: rows
  });
});

// Admin API: Get all process steps (active & inactive)
exports.getAdminProcessSteps = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, title, description, icon_name, sort_order, is_active, created_at, updated_at FROM process_steps ORDER BY sort_order ASC, id ASC"
  );
  res.json({
    success: true,
    count: rows.length,
    steps: rows
  });
});

// Admin API: Create new process step
exports.createProcessStep = asyncHandler(async (req, res) => {
  const { title, description, icon_name, sort_order, is_active } = req.body;

  if (!title || title.trim() === "") {
    throw new AppError("Step title is required", 400);
  }

  if (!description || description.trim() === "") {
    throw new AppError("Step description is required", 400);
  }

  const cleanTitle = title.trim();
  const cleanDesc = description.trim();
  const cleanIcon = icon_name && icon_name.trim() !== "" ? icon_name.trim() : "Lightbulb";
  const parsedSort = sort_order !== undefined && sort_order !== null && sort_order !== "" ? parseInt(sort_order, 10) : 0;
  const activeStatus = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : 1;

  const [result] = await db.query(
    `INSERT INTO process_steps (title, description, icon_name, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?)`,
    [
      cleanTitle,
      cleanDesc,
      cleanIcon,
      isNaN(parsedSort) ? 0 : parsedSort,
      activeStatus
    ]
  );

  const [newRow] = await db.query("SELECT * FROM process_steps WHERE id = ?", [result.insertId]);

  res.status(201).json({
    success: true,
    message: "Process step created successfully",
    step: newRow[0]
  });
});

// Admin API: Update process step
exports.updateProcessStep = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM process_steps WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Process step not found", 404);
  }
  const existing = existingRows[0];

  const { title, description, icon_name, sort_order, is_active } = req.body;

  const updatedTitle = title !== undefined ? title.trim() : existing.title;
  const updatedDesc = description !== undefined ? description.trim() : existing.description;
  const updatedIcon = icon_name !== undefined ? (icon_name.trim() !== "" ? icon_name.trim() : existing.icon_name) : existing.icon_name;
  const updatedSortOrder = sort_order !== undefined ? parseInt(sort_order, 10) : existing.sort_order;
  const updatedIsActive = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : existing.is_active;

  await db.query(
    `UPDATE process_steps
     SET title = ?,
         description = ?,
         icon_name = ?,
         sort_order = ?,
         is_active = ?
     WHERE id = ?`,
    [
      updatedTitle,
      updatedDesc,
      updatedIcon,
      isNaN(updatedSortOrder) ? existing.sort_order : updatedSortOrder,
      updatedIsActive,
      id
    ]
  );

  const [updatedRows] = await db.query("SELECT * FROM process_steps WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "Process step updated successfully",
    step: updatedRows[0]
  });
});

// Admin API: Toggle active status
exports.toggleProcessStep = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM process_steps WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Process step not found", 404);
  }
  const existing = existingRows[0];

  let newStatus;
  if (req.body.is_active !== undefined) {
    newStatus = req.body.is_active == 1 || req.body.is_active === "true" || req.body.is_active === true ? 1 : 0;
  } else {
    newStatus = existing.is_active === 1 ? 0 : 1;
  }

  await db.query("UPDATE process_steps SET is_active = ? WHERE id = ?", [newStatus, id]);

  res.json({
    success: true,
    message: `Process step ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
    is_active: newStatus
  });
});

// Admin API: Reorder process steps
exports.reorderProcessSteps = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("Items array with id and sort_order is required", 400);
  }

  for (const item of items) {
    if (item.id !== undefined && item.sort_order !== undefined) {
      await db.query("UPDATE process_steps SET sort_order = ? WHERE id = ?", [
        parseInt(item.sort_order, 10),
        item.id
      ]);
    }
  }

  res.json({
    success: true,
    message: "Process steps reordered successfully"
  });
});

// Admin API: Delete process step
exports.deleteProcessStep = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM process_steps WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Process step not found", 404);
  }

  await db.query("DELETE FROM process_steps WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "Process step deleted successfully",
    id: parseInt(id, 10)
  });
});
