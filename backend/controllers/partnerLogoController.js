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
        const filePath = path.join(__dirname, "../public/uploads", filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
  } catch (err) {
    // Ignore deletion errors gracefully
  }
};

// Public API: Get active partner logos ordered by sort_order ASC, id ASC
exports.getPartnerLogos = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, name, logo_url, website_url, alt_text, fallback_domain, sort_order, is_active FROM partner_logos WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
  );
  res.json({
    success: true,
    count: rows.length,
    logos: rows
  });
});

// Admin API: Get all partner logos (active & inactive)
exports.getAdminPartnerLogos = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, name, logo_url, website_url, alt_text, fallback_domain, sort_order, is_active, created_at, updated_at FROM partner_logos ORDER BY sort_order ASC, id ASC"
  );
  res.json({
    success: true,
    count: rows.length,
    logos: rows
  });
});

// Admin API: Create new partner logo
exports.createPartnerLogo = asyncHandler(async (req, res) => {
  const { name, website_url, alt_text, fallback_domain, sort_order, is_active } = req.body;

  let logo_url = null;
  if (req.file) {
    logo_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  } else if (req.body.logo_url && req.body.logo_url !== "null" && req.body.logo_url.trim() !== "") {
    logo_url = req.body.logo_url.trim();
  }

  if (!name || name.trim() === "") {
    throw new AppError("Brand/Company name is required", 400);
  }

  if (!logo_url) {
    throw new AppError("Logo image URL or file upload is required", 400);
  }

  const cleanAlt = alt_text && alt_text.trim() !== "" ? alt_text.trim() : name.trim();
  const cleanWebsite = website_url && website_url.trim() !== "" ? website_url.trim() : null;
  const cleanDomain = fallback_domain && fallback_domain.trim() !== "" ? fallback_domain.trim() : null;
  const parsedSort = sort_order !== undefined && sort_order !== null && sort_order !== "" ? parseInt(sort_order, 10) : 0;
  const activeStatus = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : 1;

  const [result] = await db.query(
    `INSERT INTO partner_logos (name, logo_url, website_url, alt_text, fallback_domain, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      name.trim(),
      logo_url,
      cleanWebsite,
      cleanAlt,
      cleanDomain,
      isNaN(parsedSort) ? 0 : parsedSort,
      activeStatus
    ]
  );

  const [newRow] = await db.query("SELECT * FROM partner_logos WHERE id = ?", [result.insertId]);

  res.status(201).json({
    success: true,
    message: "Partner logo created successfully",
    logo: newRow[0]
  });
});

// Admin API: Update partner logo
exports.updatePartnerLogo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM partner_logos WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Partner logo not found", 404);
  }
  const existing = existingRows[0];

  const { name, website_url, alt_text, fallback_domain, sort_order, is_active } = req.body;

  let logo_url = existing.logo_url;
  if (req.file) {
    if (existing.logo_url) {
      deleteLocalFile(existing.logo_url);
    }
    logo_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  } else if (req.body.logo_url !== undefined && req.body.logo_url !== null && req.body.logo_url.trim() !== "") {
    logo_url = req.body.logo_url.trim();
  }

  const updatedName = name !== undefined ? name.trim() : existing.name;
  const updatedAlt = alt_text !== undefined ? (alt_text.trim() !== "" ? alt_text.trim() : updatedName) : existing.alt_text;
  const updatedWebsite = website_url !== undefined ? (website_url.trim() !== "" ? website_url.trim() : null) : existing.website_url;
  const updatedDomain = fallback_domain !== undefined ? (fallback_domain.trim() !== "" ? fallback_domain.trim() : null) : existing.fallback_domain;
  const updatedSortOrder = sort_order !== undefined ? parseInt(sort_order, 10) : existing.sort_order;
  const updatedIsActive = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : existing.is_active;

  await db.query(
    `UPDATE partner_logos
     SET name = ?,
         logo_url = ?,
         website_url = ?,
         alt_text = ?,
         fallback_domain = ?,
         sort_order = ?,
         is_active = ?
     WHERE id = ?`,
    [
      updatedName,
      logo_url,
      updatedWebsite,
      updatedAlt,
      updatedDomain,
      isNaN(updatedSortOrder) ? existing.sort_order : updatedSortOrder,
      updatedIsActive,
      id
    ]
  );

  const [updatedRows] = await db.query("SELECT * FROM partner_logos WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "Partner logo updated successfully",
    logo: updatedRows[0]
  });
});

// Admin API: Toggle partner logo active status
exports.togglePartnerLogo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM partner_logos WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Partner logo not found", 404);
  }
  const existing = existingRows[0];

  let newStatus;
  if (req.body.is_active !== undefined) {
    newStatus = req.body.is_active == 1 || req.body.is_active === "true" || req.body.is_active === true ? 1 : 0;
  } else {
    newStatus = existing.is_active === 1 ? 0 : 1;
  }

  await db.query("UPDATE partner_logos SET is_active = ? WHERE id = ?", [newStatus, id]);

  res.json({
    success: true,
    message: `Partner logo ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
    is_active: newStatus
  });
});

// Admin API: Reorder partner logos
exports.reorderPartnerLogos = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("Items array with id and sort_order is required", 400);
  }

  for (const item of items) {
    if (item.id !== undefined && item.sort_order !== undefined) {
      await db.query("UPDATE partner_logos SET sort_order = ? WHERE id = ?", [
        parseInt(item.sort_order, 10),
        item.id
      ]);
    }
  }

  res.json({
    success: true,
    message: "Partner logos reordered successfully"
  });
});

// Admin API: Delete partner logo
exports.deletePartnerLogo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existingRows] = await db.query("SELECT * FROM partner_logos WHERE id = ?", [id]);
  if (existingRows.length === 0) {
    throw new AppError("Partner logo not found", 404);
  }
  const existing = existingRows[0];

  if (existing.logo_url) {
    deleteLocalFile(existing.logo_url);
  }

  await db.query("DELETE FROM partner_logos WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "Partner logo deleted successfully",
    id: parseInt(id, 10)
  });
});
