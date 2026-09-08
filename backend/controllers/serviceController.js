const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

exports.createService = asyncHandler(async (req, res) => {
  const { title, icon, short_description, full_description, price, category_id } = req.body;
  const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : req.body.image;

  const [result] = await db.query(
    `INSERT INTO services
    (title, icon, image, short_description,
    full_description, price, category_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, icon || null, image || null, short_description, full_description, price || null, category_id || null],
  );

  res.status(201).json({
    success: true,
    id: result.insertId,
  });
});

exports.getServices = asyncHandler(async (req, res) => {
  const [services] = await db.query(
    "SELECT * FROM services ORDER BY created_at DESC",
  );

  res.json(services);
});

exports.getServiceById = asyncHandler(async (req, res) => {
  const [service] = await db.query("SELECT * FROM services WHERE id=?", [
    req.params.id,
  ]);

  res.json(service[0]);
});

exports.deleteService = asyncHandler(async (req, res) => {
  await db.query("DELETE FROM services WHERE id=?", [req.params.id]);

  res.json({
    success: true,
    message: "Service Deleted",
  });
});

exports.updateService = asyncHandler(async (req, res) => {
  const { title, icon, short_description, full_description, price, category_id } = req.body;
  const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : req.body.image;

  await db.query(
    `UPDATE services 
     SET title = COALESCE(?, title), 
         icon = COALESCE(?, icon), 
         image = COALESCE(?, image), 
         short_description = COALESCE(?, short_description), 
         full_description = COALESCE(?, full_description), 
         price = COALESCE(?, price), 
         category_id = COALESCE(?, category_id)
     WHERE id = ?`,
    [title, icon, image, short_description, full_description, price, category_id, req.params.id]
  );

  res.json({
    success: true,
    message: "Service Updated",
  });
});
