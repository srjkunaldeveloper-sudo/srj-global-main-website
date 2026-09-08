const express = require("express");
const router = express.Router();
const db = require("../config/db");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { validateCreatePlan } = require("../middleware/validators");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

router.post("/", validateCreatePlan, asyncHandler(async (req, res) => {
  const {
    plan_name,
    full_name,
    email,
    phone,
    company_name,
    project_type,
    budget,
    requirements,
  } = req.body;

  const sql = `
    INSERT INTO plan_inquiries
    (plan_name, full_name, email, phone, company_name, project_type, budget, requirements)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    plan_name,
    full_name,
    email,
    phone,
    company_name,
    project_type,
    budget,
    requirements,
  ]);

  res.json({
    success: true,
    message: "Inquiry Submitted Successfully",
    id: result.insertId,
  });
}));

router.get("/", verifyToken, isAdmin, asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM plan_inquiries ORDER BY id DESC",
  );

  res.json(rows);
}));

module.exports = router;
