const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Format stat row ensuring numeric target_value
const formatStat = (row) => ({
  ...row,
  target_value: parseInt(row.target_value, 10) || 0,
  sort_order: parseInt(row.sort_order, 10) || 0,
  is_active: row.is_active === 1 || row.is_active === true ? 1 : 0
});

// Public API: Get active company stats ordered by sort_order ASC, id ASC
exports.getCompanyStats = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, metric_key, target_value, prefix, suffix, label, icon_name, sort_order, is_active FROM company_stats WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
  );
  res.json({
    success: true,
    count: rows.length,
    stats: rows.map(formatStat)
  });
});

// Admin API: Get all company stats (active & inactive)
exports.getAdminCompanyStats = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, metric_key, target_value, prefix, suffix, label, icon_name, sort_order, is_active, created_at, updated_at FROM company_stats ORDER BY sort_order ASC, id ASC"
  );
  res.json({
    success: true,
    count: rows.length,
    stats: rows.map(formatStat)
  });
});

// Admin API: Create new company stat
exports.createCompanyStat = asyncHandler(async (req, res) => {
  const { metric_key, target_value, prefix, suffix, label, icon_name, sort_order, is_active } = req.body;

  if (!metric_key || metric_key.trim() === "") {
    throw new AppError("Metric key is required", 400);
  }

  if (!label || label.trim() === "") {
    throw new AppError("Label is required", 400);
  }

  const cleanKey = metric_key.trim().toLowerCase();
  const cleanLabel = label.trim();
  const cleanPrefix = prefix !== undefined && prefix !== null ? prefix.trim() : null;
  const cleanSuffix = suffix !== undefined && suffix !== null ? suffix.trim() : "+";
  const cleanIcon = icon_name && icon_name.trim() !== "" ? icon_name.trim() : "Award";
  const parsedTarget = parseInt(target_value, 10);
  const parsedSort = sort_order !== undefined && sort_order !== null && sort_order !== "" ? parseInt(sort_order, 10) : 0;
  const activeStatus = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : 1;

  if (isNaN(parsedTarget) || parsedTarget < 0) {
    throw new AppError("Target value must be a non-negative integer", 400);
  }

  // Check unique key
  const [existingKey] = await db.query("SELECT id FROM company_stats WHERE metric_key = ?", [cleanKey]);
  if (existingKey.length > 0) {
    throw new AppError("A metric with this key already exists", 400);
  }

  const [result] = await db.query(
    `INSERT INTO company_stats (metric_key, target_value, prefix, suffix, label, icon_name, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      cleanKey,
      parsedTarget,
      cleanPrefix,
      cleanSuffix,
      cleanLabel,
      cleanIcon,
      isNaN(parsedSort) ? 0 : parsedSort,
      activeStatus
    ]
  );

  const [newRow] = await db.query("SELECT * FROM company_stats WHERE id = ?", [result.insertId]);

  res.status(201).json({
    success: true,
    message: "Company stat created successfully",
    stat: formatStat(newRow[0])
  });
});

// Admin API: Update company stat
exports.updateCompanyStat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM company_stats WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Company stat not found", 404);
  }
  const existing = existingRows[0];

  const { metric_key, target_value, prefix, suffix, label, icon_name, sort_order, is_active } = req.body;

  const updatedKey = metric_key !== undefined ? metric_key.trim().toLowerCase() : existing.metric_key;
  if (updatedKey !== existing.metric_key) {
    const [duplicateKey] = await db.query("SELECT id FROM company_stats WHERE metric_key = ? AND id != ?", [updatedKey, id]);
    if (duplicateKey.length > 0) {
      throw new AppError("A metric with this key already exists", 400);
    }
  }

  const updatedTarget = target_value !== undefined ? parseInt(target_value, 10) : existing.target_value;
  if (isNaN(updatedTarget) || updatedTarget < 0) {
    throw new AppError("Target value must be a non-negative integer", 400);
  }

  const updatedPrefix = prefix !== undefined ? (prefix !== null ? prefix.trim() : null) : existing.prefix;
  const updatedSuffix = suffix !== undefined ? (suffix !== null ? suffix.trim() : null) : existing.suffix;
  const updatedLabel = label !== undefined ? label.trim() : existing.label;
  const updatedIcon = icon_name !== undefined ? (icon_name.trim() !== "" ? icon_name.trim() : existing.icon_name) : existing.icon_name;
  const updatedSortOrder = sort_order !== undefined ? parseInt(sort_order, 10) : existing.sort_order;
  const updatedIsActive = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : existing.is_active;

  await db.query(
    `UPDATE company_stats
     SET metric_key = ?,
         target_value = ?,
         prefix = ?,
         suffix = ?,
         label = ?,
         icon_name = ?,
         sort_order = ?,
         is_active = ?
     WHERE id = ?`,
    [
      updatedKey,
      updatedTarget,
      updatedPrefix,
      updatedSuffix,
      updatedLabel,
      updatedIcon,
      isNaN(updatedSortOrder) ? existing.sort_order : updatedSortOrder,
      updatedIsActive,
      id
    ]
  );

  const [updatedRows] = await db.query("SELECT * FROM company_stats WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "Company stat updated successfully",
    stat: formatStat(updatedRows[0])
  });
});

// Admin API: Toggle active status
exports.toggleCompanyStat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query("SELECT * FROM company_stats WHERE id = ?", [id]);
  if (rows.length === 0) {
    throw new AppError("Company stat not found", 404);
  }

  const newActiveStatus = rows[0].is_active === 1 ? 0 : 1;
  await db.query("UPDATE company_stats SET is_active = ? WHERE id = ?", [newActiveStatus, id]);

  const [updatedRows] = await db.query("SELECT * FROM company_stats WHERE id = ?", [id]);

  res.json({
    success: true,
    message: `Company stat ${newActiveStatus === 1 ? "activated" : "deactivated"} successfully`,
    stat: formatStat(updatedRows[0])
  });
});

// Admin API: Reorder company stats
exports.reorderCompanyStats = asyncHandler(async (req, res) => {
  const items = req.body.items || req.body.stats || req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("Invalid or empty stats array provided for reordering", 400);
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
          "UPDATE company_stats SET sort_order = ? WHERE id = ?",
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

  const [updatedStats] = await db.query("SELECT * FROM company_stats ORDER BY sort_order ASC, id ASC");

  res.json({
    success: true,
    message: "Company stats reordered successfully",
    stats: updatedStats.map(formatStat)
  });
});

// Admin API: Delete company stat
exports.deleteCompanyStat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM company_stats WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Company stat not found", 404);
  }

  await db.query("DELETE FROM company_stats WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "Company stat deleted successfully",
    deletedId: parseInt(id, 10)
  });
});
