const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Public API: Submit contact inquiry
exports.createContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, company, service, budget, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !service || !message) {
    throw new AppError("All required fields must be provided", 400);
  }

  const cleanFirstName = firstName.trim();
  const cleanLastName = lastName.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();
  const cleanService = service.trim();
  const cleanMessage = message.trim();
  const cleanCompany = (company && typeof company === "string" && company.trim()) ? company.trim() : null;
  const cleanBudget = (budget && typeof budget === "string" && budget.trim()) ? budget.trim() : null;

  const sql = `
    INSERT INTO contacts 
    (first_name, last_name, email, phone, company, service, budget, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
  `;

  const [result] = await db.execute(sql, [
    cleanFirstName,
    cleanLastName,
    cleanEmail,
    cleanPhone,
    cleanCompany,
    cleanService,
    cleanBudget,
    cleanMessage,
  ]);

  return res.status(201).json({
    success: true,
    message: "Contact saved successfully",
    id: result.insertId,
  });
});

// Admin API: Get all contact inquiries
exports.getContacts = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, first_name, last_name, email, phone, company, service, budget, message, status, created_at, updated_at FROM contacts ORDER BY created_at DESC, id DESC"
  );

  res.json({
    success: true,
    count: rows.length,
    contacts: rows,
  });
});

// Admin API: Update contact status
exports.updateContactStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    throw new AppError("Invalid contact ID format", 400);
  }

  const { status } = req.body;
  const allowedStatuses = ["new", "contacted", "resolved"];

  if (!status || !allowedStatuses.includes(status)) {
    throw new AppError("Status must be one of: new, contacted, resolved", 400);
  }

  const [existingRows] = await db.query("SELECT * FROM contacts WHERE id = ?", [numericId]);
  if (existingRows.length === 0) {
    throw new AppError("Contact inquiry not found", 404);
  }

  await db.query("UPDATE contacts SET status = ? WHERE id = ?", [status, numericId]);

  const [updatedRows] = await db.query("SELECT * FROM contacts WHERE id = ?", [numericId]);

  res.json({
    success: true,
    message: `Contact status updated to ${status}`,
    contact: updatedRows[0],
  });
});

// Admin API: Delete contact inquiry
exports.deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    throw new AppError("Invalid contact ID format", 400);
  }

  const [existingRows] = await db.query("SELECT * FROM contacts WHERE id = ?", [numericId]);
  if (existingRows.length === 0) {
    throw new AppError("Contact inquiry not found", 404);
  }

  await db.query("DELETE FROM contacts WHERE id = ?", [numericId]);

  res.json({
    success: true,
    message: "Contact deleted successfully",
  });
});

