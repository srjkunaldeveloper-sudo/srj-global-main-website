const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Helper function to normalize features/benefits inputs into a valid JSON string
const normalizeListInput = (input) => {
  if (!input || input === "null" || input === "undefined") return "[]";

  if (Array.isArray(input)) {
    const cleaned = input.map(item => String(item).trim()).filter(Boolean);
    return JSON.stringify(cleaned);
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return "[]";

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.map(item => String(item).trim()).filter(Boolean);
          return JSON.stringify(cleaned);
        }
      } catch (e) {
        // Fallback to comma-splitting if JSON parsing fails
      }
    }

    const cleaned = trimmed.split(",").map(item => item.trim()).filter(Boolean);
    return JSON.stringify(cleaned);
  }

  return "[]";
};

// Helper function to safely format database row and parse features/benefits into JS arrays
const formatIndustryRow = (row) => {
  if (!row) return null;

  let parsedFeatures = [];
  let parsedBenefits = [];

  if (row.features) {
    if (Array.isArray(row.features)) {
      parsedFeatures = row.features;
    } else if (typeof row.features === "string") {
      try {
        parsedFeatures = JSON.parse(row.features);
        if (!Array.isArray(parsedFeatures)) parsedFeatures = [];
      } catch (e) {
        parsedFeatures = row.features ? row.features.split(",").map(s => s.trim()).filter(Boolean) : [];
      }
    }
  }

  if (row.benefits) {
    if (Array.isArray(row.benefits)) {
      parsedBenefits = row.benefits;
    } else if (typeof row.benefits === "string") {
      try {
        parsedBenefits = JSON.parse(row.benefits);
        if (!Array.isArray(parsedBenefits)) parsedBenefits = [];
      } catch (e) {
        parsedBenefits = row.benefits ? row.benefits.split(",").map(s => s.trim()).filter(Boolean) : [];
      }
    }
  }

  return {
    ...row,
    features: parsedFeatures,
    benefits: parsedBenefits
  };
};

// Public API: Get all active industries ordered by sort_order ASC, created_at DESC, id ASC
// Preserves raw array response format for backward compatibility
exports.getIndustries = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM industries WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC, id ASC"
  );
  
  const formattedIndustries = rows.map(formatIndustryRow);
  res.json(formattedIndustries);
});

// Public API: Get single active industry by ID/slug
exports.getIndustryById = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM industries WHERE id = ? AND is_active = 1",
    [req.params.id]
  );

  if (rows.length === 0) {
    throw new AppError("Industry not found", 404);
  }

  res.json(formatIndustryRow(rows[0]));
});

// Admin API: Get all industries (active & inactive)
exports.getAdminIndustries = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM industries ORDER BY sort_order ASC, created_at DESC, id ASC"
  );

  const formattedIndustries = rows.map(formatIndustryRow);
  res.json({
    success: true,
    industries: formattedIndustries
  });
});

// Admin API: Create a new industry
exports.createIndustry = asyncHandler(async (req, res) => {
  const { id, title, subtitle, icon, color, description, badge, features, benefits, sort_order, is_active } = req.body;

  const slug = id.trim().toLowerCase();

  // Check for duplicate ID
  const [existing] = await db.query("SELECT id FROM industries WHERE id = ?", [slug]);
  if (existing.length > 0) {
    throw new AppError("Industry with this ID already exists", 409);
  }

  const normalizedFeatures = normalizeListInput(features);
  const normalizedBenefits = normalizeListInput(benefits);
  const activeStatus = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : 1;
  const order = sort_order !== undefined ? parseInt(sort_order, 10) : 0;

  await db.query(
    `INSERT INTO industries (id, title, subtitle, icon, color, description, badge, features, benefits, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      slug,
      title.trim(),
      subtitle.trim(),
      icon.trim(),
      color.trim(),
      description.trim(),
      badge.trim(),
      normalizedFeatures,
      normalizedBenefits,
      activeStatus,
      order
    ]
  );

  res.status(201).json({
    success: true,
    message: "Industry created successfully",
    id: slug
  });
});

// Admin API: Update an existing industry with partial update semantics
exports.updateIndustry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM industries WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Industry not found", 404);
  }
  const existing = existingRows[0];

  const { title, subtitle, icon, color, description, badge, features, benefits, sort_order, is_active } = req.body;

  const updatedTitle = title !== undefined ? title.trim() : existing.title;
  const updatedSubtitle = subtitle !== undefined ? subtitle.trim() : existing.subtitle;
  const updatedIcon = icon !== undefined ? icon.trim() : existing.icon;
  const updatedColor = color !== undefined ? color.trim() : existing.color;
  const updatedDescription = description !== undefined ? description.trim() : existing.description;
  const updatedBadge = badge !== undefined ? badge.trim() : existing.badge;
  const updatedFeatures = features !== undefined ? normalizeListInput(features) : existing.features;
  const updatedBenefits = benefits !== undefined ? normalizeListInput(benefits) : existing.benefits;
  const updatedSortOrder = sort_order !== undefined ? parseInt(sort_order, 10) : existing.sort_order;
  const updatedIsActive = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : existing.is_active;

  await db.query(
    `UPDATE industries 
     SET title = ?, subtitle = ?, icon = ?, color = ?, description = ?, badge = ?, features = ?, benefits = ?, sort_order = ?, is_active = ?
     WHERE id = ?`,
    [
      updatedTitle,
      updatedSubtitle,
      updatedIcon,
      updatedColor,
      updatedDescription,
      updatedBadge,
      updatedFeatures,
      updatedBenefits,
      updatedSortOrder,
      updatedIsActive,
      id
    ]
  );

  res.json({
    success: true,
    message: "Industry updated successfully"
  });
});

// Admin API: Toggle active status of an industry
exports.toggleIndustry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM industries WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Industry not found", 404);
  }
  const existing = existingRows[0];

  const newStatus = existing.is_active === 1 ? 0 : 1;

  await db.query("UPDATE industries SET is_active = ? WHERE id = ?", [newStatus, id]);

  res.json({
    success: true,
    message: "Industry status updated successfully",
    is_active: newStatus
  });
});

// Admin API: Permanently delete an industry
exports.deleteIndustry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM industries WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Industry not found", 404);
  }

  await db.query("DELETE FROM industries WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "Industry deleted successfully"
  });
});
