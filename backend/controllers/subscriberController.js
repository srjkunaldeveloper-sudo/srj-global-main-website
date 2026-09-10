const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Public API: Subscribe to newsletter
// Accepts JSON body: { "email": "visitor@example.com" }
exports.subscribe = asyncHandler(async (req, res) => {
  const rawEmail = req.body.email;
  if (!rawEmail || typeof rawEmail !== "string") {
    throw new AppError("Email is required", 400);
  }

  const normalizedEmail = rawEmail.trim().toLowerCase();

  // Check if subscriber email already exists in database
  const [existingRows] = await db.query(
    "SELECT * FROM subscribers WHERE email = ?",
    [normalizedEmail]
  );

  if (existingRows.length > 0) {
    const existing = existingRows[0];

    // Case A: Email exists and status is active -> Return 200 without creating duplicate
    if (existing.status === "active") {
      return res.status(200).json({
        success: true,
        message: "You are already subscribed to our newsletter!"
      });
    }

    // Case B: Email exists and status is unsubscribed -> Reactivate
    await db.query(
      `UPDATE subscribers
       SET status = 'active',
           subscribed_at = CURRENT_TIMESTAMP,
           unsubscribed_at = NULL
       WHERE id = ?`,
      [existing.id]
    );

    return res.status(200).json({
      success: true,
      message: "Welcome back! Your subscription has been reactivated."
    });
  }

  // Case C: New subscriber -> Insert record
  const [result] = await db.query(
    `INSERT INTO subscribers (email, status, source)
     VALUES (?, 'active', 'website_footer_blog')`,
    [normalizedEmail]
  );

  res.status(201).json({
    success: true,
    message: "Thank you for subscribing to our newsletter!",
    id: result.insertId
  });
});

// Admin API: Get all subscribers (active & unsubscribed) ordered newest first
exports.getAdminSubscribers = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, email, status, source, subscribed_at, unsubscribed_at, created_at, updated_at FROM subscribers ORDER BY subscribed_at DESC, id DESC"
  );
  res.json({
    success: true,
    subscribers: rows
  });
});

// Admin API: Toggle active ↔ unsubscribed status
exports.toggleSubscriberStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new AppError("Invalid subscriber ID format", 400);
  }

  const [existingRows] = await db.query("SELECT * FROM subscribers WHERE id = ?", [numericId]);
  if (existingRows.length === 0) {
    throw new AppError("Subscriber not found", 404);
  }
  const existing = existingRows[0];

  let newStatus;
  let subscribedAt = existing.subscribed_at;
  let unsubscribedAt = existing.unsubscribed_at;

  if (existing.status === "active") {
    newStatus = "unsubscribed";
    unsubscribedAt = new Date();
  } else {
    newStatus = "active";
    subscribedAt = new Date();
    unsubscribedAt = null;
  }

  await db.query(
    `UPDATE subscribers
     SET status = ?,
         subscribed_at = ?,
         unsubscribed_at = ?
     WHERE id = ?`,
    [newStatus, subscribedAt, unsubscribedAt, numericId]
  );

  res.json({
    success: true,
    message: "Subscriber status updated successfully",
    status: newStatus
  });
});

// Admin API: Delete a subscriber
exports.deleteSubscriber = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new AppError("Invalid subscriber ID format", 400);
  }

  const [existingRows] = await db.query("SELECT * FROM subscribers WHERE id = ?", [numericId]);
  if (existingRows.length === 0) {
    throw new AppError("Subscriber not found", 404);
  }

  await db.query("DELETE FROM subscribers WHERE id = ?", [numericId]);

  res.json({
    success: true,
    message: "Subscriber deleted successfully"
  });
});
