const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Format trust point row
const formatTrustPoint = (row) => ({
  ...row,
  sort_order: parseInt(row.sort_order, 10) || 0,
  is_active: row.is_active === 1 || row.is_active === true ? 1 : 0
});

// Public API: Get active trust points ordered by sort_order ASC, id ASC
exports.getTrustPoints = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, title, description, icon_name, sort_order, is_active FROM trust_points WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
  );
  res.json({
    success: true,
    count: rows.length,
    points: rows.map(formatTrustPoint)
  });
});

// Admin API: Get all trust points (active & inactive)
exports.getAdminTrustPoints = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, title, description, icon_name, sort_order, is_active, created_at, updated_at FROM trust_points ORDER BY sort_order ASC, id ASC"
  );
  res.json({
    success: true,
    count: rows.length,
    points: rows.map(formatTrustPoint)
  });
});

// Admin API: Create new trust point
exports.createTrustPoint = asyncHandler(async (req, res) => {
  const { title, description, icon_name, sort_order, is_active } = req.body;

  if (!title || title.trim() === "") {
    throw new AppError("Title is required", 400);
  }

  if (!description || description.trim() === "") {
    throw new AppError("Description is required", 400);
  }

  const cleanTitle = title.trim();
  const cleanDesc = description.trim();
  const cleanIcon = icon_name && icon_name.trim() !== "" ? icon_name.trim() : "CheckCircle2";
  const parsedSort = sort_order !== undefined && sort_order !== null && sort_order !== "" ? parseInt(sort_order, 10) : 0;
  const activeStatus = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : 1;

  const [result] = await db.query(
    `INSERT INTO trust_points (title, description, icon_name, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?)`,
    [
      cleanTitle,
      cleanDesc,
      cleanIcon,
      isNaN(parsedSort) ? 0 : parsedSort,
      activeStatus
    ]
  );

  const [newRow] = await db.query("SELECT * FROM trust_points WHERE id = ?", [result.insertId]);

  res.status(201).json({
    success: true,
    message: "Trust point created successfully",
    point: formatTrustPoint(newRow[0])
  });
});

// Admin API: Update trust point
exports.updateTrustPoint = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM trust_points WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Trust point not found", 404);
  }
  const existing = existingRows[0];

  const { title, description, icon_name, sort_order, is_active } = req.body;

  const updatedTitle = title !== undefined ? title.trim() : existing.title;
  const updatedDesc = description !== undefined ? description.trim() : existing.description;
  const updatedIcon = icon_name !== undefined ? (icon_name.trim() !== "" ? icon_name.trim() : existing.icon_name) : existing.icon_name;
  const updatedSortOrder = sort_order !== undefined ? parseInt(sort_order, 10) : existing.sort_order;
  const updatedIsActive = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : existing.is_active;

  await db.query(
    `UPDATE trust_points
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

  const [updatedRows] = await db.query("SELECT * FROM trust_points WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "Trust point updated successfully",
    point: formatTrustPoint(updatedRows[0])
  });
});

// Admin API: Toggle active status
exports.toggleTrustPoint = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query("SELECT * FROM trust_points WHERE id = ?", [id]);
  if (rows.length === 0) {
    throw new AppError("Trust point not found", 404);
  }

  const newActiveStatus = rows[0].is_active === 1 ? 0 : 1;
  await db.query("UPDATE trust_points SET is_active = ? WHERE id = ?", [newActiveStatus, id]);

  const [updatedRows] = await db.query("SELECT * FROM trust_points WHERE id = ?", [id]);

  res.json({
    success: true,
    message: `Trust point ${newActiveStatus === 1 ? "activated" : "deactivated"} successfully`,
    point: formatTrustPoint(updatedRows[0])
  });
});

// Admin API: Reorder trust points
exports.reorderTrustPoints = asyncHandler(async (req, res) => {
  const items = req.body.items || req.body.points || req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("Invalid or empty points array provided for reordering", 400);
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const itemId = item.id;
      const order = item.sort_order !== undefined ? parseInt(item.sort_order, 10) : index + 1;

      if (itemId) {
        await connection.query(
          "UPDATE trust_points SET sort_order = ? WHERE id = ?",
          [isNaN(order) ? index + 1 : order, itemId]
        );
      }
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  const [updatedPoints] = await db.query("SELECT * FROM trust_points ORDER BY sort_order ASC, id ASC");

  res.json({
    success: true,
    message: "Trust points reordered successfully",
    points: updatedPoints.map(formatTrustPoint)
  });
});

// Admin API: Delete trust point
exports.deleteTrustPoint = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM trust_points WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Trust point not found", 404);
  }

  await db.query("DELETE FROM trust_points WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "Trust point deleted successfully",
    deletedId: parseInt(id, 10)
  });
});
