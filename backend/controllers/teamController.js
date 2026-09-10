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
        const filePath = path.join(__dirname, "../public/uploads", filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          // Fallback check for alternative directory path
          const altFilePath = path.join(__dirname, "../uploads", filename);
          if (fs.existsSync(altFilePath)) {
            fs.unlinkSync(altFilePath);
          }
        }
      }
    }
  } catch (err) {
    // Ignore deletion errors gracefully
  }
};

// Public API: Get active team members ordered by sort_order ASC, created_at DESC, id ASC
exports.getTeamMembers = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM team_members WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC, id ASC"
  );
  res.json({
    success: true,
    team: rows
  });
});

// Public API: Get single active team member by numeric ID
exports.getTeamMemberById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new AppError("Invalid member ID format", 400);
  }

  const [rows] = await db.query(
    "SELECT * FROM team_members WHERE id = ? AND is_active = 1",
    [numericId]
  );

  if (rows.length === 0) {
    throw new AppError("Team member not found", 404);
  }

  res.json({
    success: true,
    member: rows[0]
  });
});

// Admin API: Get all team members (active & inactive)
exports.getAdminTeamMembers = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM team_members ORDER BY sort_order ASC, created_at DESC, id ASC"
  );
  res.json({
    success: true,
    team: rows
  });
});

// Admin API: Create a new team member
exports.createTeamMember = asyncHandler(async (req, res) => {
  const {
    name,
    role,
    role_class,
    bio,
    featured,
    online,
    verified,
    badge,
    linkedin,
    github,
    twitter,
    email,
    website,
    is_active,
    sort_order
  } = req.body;

  const image = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : (req.body.image && req.body.image !== "null" && req.body.image !== "" ? req.body.image : null);

  const isFeatured = featured == 1 || featured === "true" || featured === true ? 1 : 0;
  const isOnline = online !== undefined ? (online == 1 || online === "true" || online === true ? 1 : 0) : 1;
  const isVerified = verified == 1 || verified === "true" || verified === true ? 1 : 0;
  const activeStatus = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : 1;
  const order = sort_order !== undefined ? parseInt(sort_order, 10) || 0 : 0;

  const [result] = await db.query(
    `INSERT INTO team_members 
      (name, role, role_class, bio, image, featured, online, verified, badge, linkedin, github, twitter, email, website, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name.trim(),
      role.trim(),
      role_class && role_class.trim() ? role_class.trim() : "dev",
      bio.trim(),
      image,
      isFeatured,
      isOnline,
      isVerified,
      badge && badge.trim() ? badge.trim() : null,
      linkedin && linkedin.trim() ? linkedin.trim() : null,
      github && github.trim() ? github.trim() : null,
      twitter && twitter.trim() ? twitter.trim() : null,
      email && email.trim() ? email.trim() : null,
      website && website.trim() ? website.trim() : null,
      activeStatus,
      order
    ]
  );

  res.status(201).json({
    success: true,
    message: "Team member created successfully",
    id: result.insertId
  });
});

// Admin API: Update team member (partial updates supported)
exports.updateTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new AppError("Invalid member ID format", 400);
  }

  const [existingRows] = await db.query("SELECT * FROM team_members WHERE id = ?", [numericId]);
  if (existingRows.length === 0) {
    throw new AppError("Team member not found", 404);
  }
  const existing = existingRows[0];

  const {
    name,
    role,
    role_class,
    bio,
    featured,
    online,
    verified,
    badge,
    linkedin,
    github,
    twitter,
    email,
    website,
    is_active,
    sort_order
  } = req.body;

  const updatedName = name !== undefined ? name.trim() : existing.name;
  const updatedRole = role !== undefined ? role.trim() : existing.role;
  const updatedRoleClass = role_class !== undefined ? (role_class.trim() || "dev") : existing.role_class;
  const updatedBio = bio !== undefined ? bio.trim() : existing.bio;
  const updatedBadge = badge !== undefined ? (badge.trim() || null) : existing.badge;
  const updatedLinkedin = linkedin !== undefined ? (linkedin.trim() || null) : existing.linkedin;
  const updatedGithub = github !== undefined ? (github.trim() || null) : existing.github;
  const updatedTwitter = twitter !== undefined ? (twitter.trim() || null) : existing.twitter;
  const updatedEmail = email !== undefined ? (email.trim() || null) : existing.email;
  const updatedWebsite = website !== undefined ? (website.trim() || null) : existing.website;
  const updatedFeatured = featured !== undefined ? (featured == 1 || featured === "true" || featured === true ? 1 : 0) : existing.featured;
  const updatedOnline = online !== undefined ? (online == 1 || online === "true" || online === true ? 1 : 0) : existing.online;
  const updatedVerified = verified !== undefined ? (verified == 1 || verified === "true" || verified === true ? 1 : 0) : existing.verified;
  const updatedIsActive = is_active !== undefined ? (is_active == 1 || is_active === "true" || is_active === true ? 1 : 0) : existing.is_active;
  const updatedSortOrder = sort_order !== undefined ? (parseInt(sort_order, 10) || 0) : existing.sort_order;

  let updatedImage = existing.image;
  if (req.file) {
    if (existing.image) {
      deleteLocalFile(existing.image);
    }
    updatedImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  } else if (req.body.image === "REMOVE" || req.body.image === "" || req.body.image === null) {
    if (existing.image) {
      deleteLocalFile(existing.image);
    }
    updatedImage = null;
  } else if (req.body.image !== undefined) {
    updatedImage = req.body.image;
  }

  await db.query(
    `UPDATE team_members
     SET name = ?,
         role = ?,
         role_class = ?,
         bio = ?,
         image = ?,
         featured = ?,
         online = ?,
         verified = ?,
         badge = ?,
         linkedin = ?,
         github = ?,
         twitter = ?,
         email = ?,
         website = ?,
         is_active = ?,
         sort_order = ?
     WHERE id = ?`,
    [
      updatedName,
      updatedRole,
      updatedRoleClass,
      updatedBio,
      updatedImage,
      updatedFeatured,
      updatedOnline,
      updatedVerified,
      updatedBadge,
      updatedLinkedin,
      updatedGithub,
      updatedTwitter,
      updatedEmail,
      updatedWebsite,
      updatedIsActive,
      updatedSortOrder,
      numericId
    ]
  );

  res.json({
    success: true,
    message: "Team member updated successfully"
  });
});

// Admin API: Toggle active status
exports.toggleTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new AppError("Invalid member ID format", 400);
  }

  const [existingRows] = await db.query("SELECT * FROM team_members WHERE id = ?", [numericId]);
  if (existingRows.length === 0) {
    throw new AppError("Team member not found", 404);
  }
  const existing = existingRows[0];

  const newStatus = req.body && req.body.is_active !== undefined
    ? (req.body.is_active == 1 || req.body.is_active === "true" || req.body.is_active === true ? 1 : 0)
    : (existing.is_active === 1 ? 0 : 1);

  await db.query("UPDATE team_members SET is_active = ? WHERE id = ?", [newStatus, numericId]);

  res.json({
    success: true,
    message: "Team member status updated",
    is_active: newStatus
  });
});

// Admin API: Delete team member (with local file cleanup)
exports.deleteTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new AppError("Invalid member ID format", 400);
  }

  const [existingRows] = await db.query("SELECT * FROM team_members WHERE id = ?", [numericId]);
  if (existingRows.length === 0) {
    throw new AppError("Team member not found", 404);
  }
  const existing = existingRows[0];

  if (existing.image) {
    deleteLocalFile(existing.image);
  }

  await db.query("DELETE FROM team_members WHERE id = ?", [numericId]);

  res.json({
    success: true,
    message: "Team member deleted successfully"
  });
});
