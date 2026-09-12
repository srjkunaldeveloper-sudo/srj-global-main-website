const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// 1. GET /api/auth/users (Admin / Super Admin view all users)
exports.getUsers = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC");

  res.json({
    success: true,
    users: rows,
  });
});

// 2. POST /api/auth/register (Public Registration - Strictly assigns role = "user")
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const [existingUser] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existingUser.length > 0) {
    throw new AppError("Email already registered", 400);
  }

  const hash = await bcrypt.hash(password, 10);

  // Security Requirement: Public registration ALWAYS assigns 'user' role
  const role = "user";

  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)",
    [name, email, hash, role, 1]
  );

  res.status(201).json({
    success: true,
    message: "Registration successful",
    userId: result.insertId,
    role,
  });
});

// 3. POST /api/auth/login (Login for all user roles)
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  if (rows.length === 0) {
    throw new AppError("Invalid email or password", 400);
  }

  const user = rows[0];

  if (user.is_active === 0) {
    throw new AppError("Account deactivated. Please contact Super Admin.", 403);
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new AppError("Invalid email or password", 400);
  }

  const secret = process.env.JWT_SECRET || "srj_global_secret_key_2026";
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// 4. POST /api/auth/forgot-password (Anti-User Enumeration + SHA-256 Hashed Reset Token)
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const [rows] = await db.query(
    "SELECT id, email, is_active FROM users WHERE email = ?",
    [email]
  );

  let rawToken = null;

  if (rows.length > 0 && rows[0].is_active !== 0) {
    rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await db.query(
      "UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?",
      [hashedToken, expires, rows[0].id]
    );
  }

  // Security Requirement: Constant-time generic response to prevent user enumeration
  res.json({
    success: true,
    message: "If an account exists, reset instructions have been sent.",
    ...(rawToken && process.env.NODE_ENV !== "production" ? { debugResetToken: rawToken } : {})
  });
});

// 5. POST /api/auth/reset-password (Validate SHA-256 Hashed Token & Update Password)
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new AppError("Token and new password are required", 400);
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const [rows] = await db.query(
    "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW() AND is_active = 1",
    [hashedToken]
  );

  if (rows.length === 0) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const user = rows[0];
  const hash = await bcrypt.hash(newPassword, 10);

  await db.query(
    "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?",
    [hash, user.id]
  );

  res.json({
    success: true,
    message: "Password reset successfully. You can now log in with your new password.",
  });
});

// 6. GET /api/auth/admins (Super Admin Only: Get list of admins & super_admins)
exports.getAdminUsers = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, name, email, role, is_active, created_at FROM users WHERE role IN ('admin', 'super_admin') ORDER BY created_at DESC"
  );

  res.json({
    success: true,
    admins: rows,
  });
});

// 7. POST /api/auth/create-admin (Super Admin Only: Create new Admin or Super Admin)
exports.createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }

  const targetRole = role === "super_admin" ? "super_admin" : "admin";

  const [existingUser] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existingUser.length > 0) {
    throw new AppError("User with this email already exists", 400);
  }

  const hash = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)",
    [name, email, hash, targetRole, 1]
  );

  res.status(201).json({
    success: true,
    message: `${targetRole === "super_admin" ? "Super Admin" : "Admin"} account created successfully`,
    id: result.insertId,
  });
});

// 8. POST /api/auth/reset-admin-password (Super Admin Only: Manual password override)
exports.superAdminResetPassword = asyncHandler(async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    throw new AppError("User ID and new password are required", 400);
  }

  const [rows] = await db.query("SELECT id, name, role FROM users WHERE id = ?", [userId]);
  if (rows.length === 0) {
    throw new AppError("User not found", 404);
  }

  const hash = await bcrypt.hash(newPassword, 10);

  await db.query("UPDATE users SET password = ? WHERE id = ?", [hash, userId]);

  res.json({
    success: true,
    message: `Password updated successfully for ${rows[0].name}`,
  });
});

// 9. PUT /api/auth/admins/:id/toggle (Super Admin Only: Toggle account status with Last Super Admin Guard)
exports.toggleAdminStatus = asyncHandler(async (req, res) => {
  const targetId = parseInt(req.params.id, 10);

  const [rows] = await db.query("SELECT id, name, role, is_active FROM users WHERE id = ?", [targetId]);
  if (rows.length === 0) {
    throw new AppError("User not found", 404);
  }

  const targetUser = rows[0];

  // Guard: Protect Last Active Super Admin
  if (targetUser.role === "super_admin" && targetUser.is_active === 1) {
    const [superRows] = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'super_admin' AND is_active = 1"
    );

    if (superRows[0].count <= 1) {
      throw new AppError("Cannot deactivate the last active Super Admin account.", 400);
    }
  }

  const newStatus = targetUser.is_active ? 0 : 1;
  await db.query("UPDATE users SET is_active = ? WHERE id = ?", [newStatus, targetId]);

  res.json({
    success: true,
    message: `Account status updated to ${newStatus === 1 ? "active" : "deactivated"}`,
    is_active: newStatus,
  });
});

// 10. DELETE /api/auth/admins/:id (Super Admin Only: Delete admin account with Last Super Admin Guard)
exports.deleteAdmin = asyncHandler(async (req, res) => {
  const targetId = parseInt(req.params.id, 10);

  const [rows] = await db.query("SELECT id, name, role, is_active FROM users WHERE id = ?", [targetId]);
  if (rows.length === 0) {
    throw new AppError("User not found", 404);
  }

  const targetUser = rows[0];

  // Guard: Protect Last Active Super Admin
  if (targetUser.role === "super_admin" && targetUser.is_active === 1) {
    const [superRows] = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'super_admin' AND is_active = 1"
    );

    if (superRows[0].count <= 1) {
      throw new AppError("Cannot delete the last active Super Admin account.", 400);
    }
  }

  await db.query("DELETE FROM users WHERE id = ?", [targetId]);

  res.json({
    success: true,
    message: `Account deleted successfully`,
  });
});

// 11. PUT /api/auth/admins/:id/role (Super Admin Only: Update user role with Last Super Admin Guard)
exports.updateAdminRole = asyncHandler(async (req, res) => {
  const targetId = parseInt(req.params.id, 10);
  const { role } = req.body;

  if (!role || !["admin", "super_admin"].includes(role)) {
    throw new AppError("Role must be 'admin' or 'super_admin'", 400);
  }

  const [rows] = await db.query("SELECT id, name, role, is_active FROM users WHERE id = ?", [targetId]);
  if (rows.length === 0) {
    throw new AppError("User not found", 404);
  }

  const targetUser = rows[0];

  // Guard: Protect Last Active Super Admin from being demoted
  if (targetUser.role === "super_admin" && role !== "super_admin" && targetUser.is_active === 1) {
    const [superRows] = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'super_admin' AND is_active = 1"
    );

    if (superRows[0].count <= 1) {
      throw new AppError("Cannot change role of the last active Super Admin account.", 400);
    }
  }

  await db.query("UPDATE users SET role = ? WHERE id = ?", [role, targetId]);

  res.json({
    success: true,
    message: `Role updated to ${role === "super_admin" ? "Super Admin" : "Admin"} for ${targetUser.name}`,
    role,
  });
});

