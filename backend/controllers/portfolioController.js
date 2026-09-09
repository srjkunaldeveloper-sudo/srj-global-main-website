const fs = require("fs");
const path = require("path");
const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Helper function to safely delete locally stored uploaded images (never external URLs)
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

// Helper function to parse and normalize tags into a JavaScript Array
const parseTagsInput = (tagsInput) => {
  if (!tagsInput || tagsInput === "null" || tagsInput === "undefined") return null;
  
  if (Array.isArray(tagsInput)) {
    const cleaned = tagsInput.map(t => String(t).trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : null;
  }

  if (typeof tagsInput === "string") {
    const trimmed = tagsInput.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.map(t => String(t).trim()).filter(Boolean);
          return cleaned.length > 0 ? cleaned : null;
        }
      } catch (e) {
        // Fallback to comma-splitting if JSON parsing fails
      }
    }

    // Comma-separated string format e.g. "React, Next.js, PostgreSQL"
    const cleaned = trimmed.split(",").map(t => t.trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : null;
  }

  return null;
};

// Helper function to format database row and ensure tags is a JS array
const formatPortfolioRow = (row) => {
  if (!row) return null;

  let parsedTags = [];
  if (row.tags !== null && row.tags !== undefined) {
    if (Array.isArray(row.tags)) {
      parsedTags = row.tags;
    } else if (typeof row.tags === "string") {
      try {
        const parsed = JSON.parse(row.tags);
        if (Array.isArray(parsed)) {
          parsedTags = parsed;
        }
      } catch (e) {
        parsedTags = [];
      }
    }
  }

  return {
    ...row,
    tags: parsedTags
  };
};

// Public API: Get active portfolio items (is_active = 1)
exports.getPortfolio = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM portfolio WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC, id DESC"
  );

  const formattedPortfolio = rows.map(formatPortfolioRow);

  res.json({
    success: true,
    portfolio: formattedPortfolio
  });
});

// Admin API: Get all portfolio items (active & inactive)
exports.getAdminPortfolio = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM portfolio ORDER BY sort_order ASC, created_at DESC, id DESC"
  );

  const formattedPortfolio = rows.map(formatPortfolioRow);

  res.json({
    success: true,
    portfolio: formattedPortfolio
  });
});

// Admin API: Create a new portfolio item
exports.createPortfolio = asyncHandler(async (req, res) => {
  const { title, category, tags, project_url, description, is_active, sort_order } = req.body;

  const image = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : (req.body.image && req.body.image !== "null" && req.body.image !== "" ? req.body.image : null);

  const parsedTags = parseTagsInput(tags);

  const [result] = await db.query(
    `INSERT INTO portfolio (title, category, tags, image, project_url, description, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title.trim(),
      category.trim(),
      parsedTags ? JSON.stringify(parsedTags) : null,
      image,
      project_url && project_url.trim() !== "" ? project_url.trim() : null,
      description && description.trim() !== "" ? description.trim() : null,
      is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : 1,
      sort_order ? parseInt(sort_order, 10) : 0
    ]
  );

  res.status(201).json({
    success: true,
    message: "Portfolio item created successfully",
    id: result.insertId
  });
});

// Admin API: Update existing portfolio item with partial update semantics & file cleanup
exports.updatePortfolio = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM portfolio WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Portfolio item not found", 404);
  }
  const existing = existingRows[0];

  const { title, category, tags, project_url, description, is_active, sort_order } = req.body;

  // Partial update semantics
  const updatedTitle = title !== undefined ? title.trim() : existing.title;
  const updatedCategory = category !== undefined ? category.trim() : existing.category;

  let updatedTags = parseTagsInput(existing.tags);
  if (tags !== undefined) {
    updatedTags = parseTagsInput(tags);
  }

  let updatedProjectUrl = existing.project_url;
  if (project_url !== undefined) {
    updatedProjectUrl = (project_url !== null && project_url.trim() !== "" && project_url !== "REMOVE") ? project_url.trim() : null;
  }

  let updatedDescription = existing.description;
  if (description !== undefined) {
    updatedDescription = (description !== null && description.trim() !== "") ? description.trim() : null;
  }

  const updatedIsActive = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : existing.is_active;
  const updatedSortOrder = sort_order !== undefined ? parseInt(sort_order, 10) : existing.sort_order;

  let updatedImage = existing.image;
  if (req.file) {
    // New local file uploaded -> cleanup old local upload
    if (existing.image) {
      deleteLocalFile(existing.image);
    }
    updatedImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  } else if (req.body.image === "REMOVE" || req.body.image === "" || req.body.image === null) {
    // Image explicitly removed/cleared
    if (existing.image) {
      deleteLocalFile(existing.image);
    }
    updatedImage = null;
  } else if (req.body.image !== undefined) {
    updatedImage = req.body.image;
  }

  await db.query(
    `UPDATE portfolio 
     SET title = ?, 
         category = ?, 
         tags = ?, 
         image = ?, 
         project_url = ?, 
         description = ?, 
         is_active = ?, 
         sort_order = ?
     WHERE id = ?`,
    [
      updatedTitle,
      updatedCategory,
      updatedTags ? JSON.stringify(updatedTags) : null,
      updatedImage,
      updatedProjectUrl,
      updatedDescription,
      updatedIsActive,
      updatedSortOrder,
      id
    ]
  );

  res.json({
    success: true,
    message: "Portfolio item updated successfully"
  });
});

// Admin API: Toggle active status
exports.togglePortfolio = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  const [existingRows] = await db.query("SELECT * FROM portfolio WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Portfolio item not found", 404);
  }

  const activeStatus = is_active == 1 || is_active === "true" || is_active === true ? 1 : 0;

  await db.query("UPDATE portfolio SET is_active = ? WHERE id = ?", [
    activeStatus,
    id
  ]);

  res.json({
    success: true,
    message: "Portfolio status updated"
  });
});

// Admin API: Delete portfolio item with local image cleanup
exports.deletePortfolio = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM portfolio WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Portfolio item not found", 404);
  }
  const existing = existingRows[0];

  if (existing.image) {
    deleteLocalFile(existing.image);
  }

  await db.query("DELETE FROM portfolio WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "Portfolio item deleted successfully"
  });
});
