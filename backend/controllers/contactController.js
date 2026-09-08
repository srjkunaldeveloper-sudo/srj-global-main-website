const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

exports.createContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, service, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !service || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const sql = `
    INSERT INTO contacts 
    (first_name, last_name, email, phone, service, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  await db.execute(sql, [
    firstName,
    lastName,
    email,
    phone,
    service,
    message,
  ]);

  return res.status(201).json({
    success: true,
    message: "Contact saved successfully",
  });
});

exports.getContacts = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM contacts ORDER BY id DESC");

  res.json(rows);
});

exports.deleteContact = asyncHandler(async (req, res) => {
  await db.query("DELETE FROM contacts WHERE id = ?", [req.params.id]);

  res.json({
    success: true,
    message: "Contact deleted",
  });
});
