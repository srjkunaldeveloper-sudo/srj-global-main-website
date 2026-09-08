const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gmail.com";

exports.getUsers = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT id, name, email, role FROM users");

  res.json({
    success: true,
    users: rows,
  });
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const [existingUser] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
  );

  if (existingUser.length > 0) {
    throw new AppError("Email already registered", 400);
  }

  const hash = await bcrypt.hash(password, 10);

  const role = email === ADMIN_EMAIL ? "admin" : "user";

  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hash, role],
  );

  res.status(201).json({
    success: true,
    message: "Registration successful",
    userId: result.insertId,
    role,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (rows.length === 0) {
    throw new AppError("User not found", 400);
  }

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new AppError("Invalid password", 400);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

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
