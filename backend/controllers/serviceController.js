const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }
  return [];
};

exports.createService = asyncHandler(async (req, res) => {
  const { title, icon, short_description, full_description, price, category_id, is_home, tags, sort_order } = req.body;
  const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : req.body.image;

  const isHomeVal = is_home === true || is_home === "true" || is_home == 1 ? 1 : 0;
  const sortOrderVal = parseInt(sort_order, 10) || 0;
  const formattedTags = JSON.stringify(parseTags(tags));

  const [result] = await db.query(
    `INSERT INTO services
    (title, icon, image, short_description, full_description, price, category_id, tags, is_home, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, icon || null, image || null, short_description, full_description, price || null, category_id || null, formattedTags, isHomeVal, sortOrderVal],
  );

  res.status(201).json({
    success: true,
    id: result.insertId,
  });
});

exports.getServices = asyncHandler(async (req, res) => {
  const isHomeOnly = req.query.is_home === "true" || req.query.is_home === "1";

  const querySql = isHomeOnly
    ? "SELECT * FROM services WHERE is_home = 1 ORDER BY sort_order ASC, created_at DESC"
    : "SELECT * FROM services ORDER BY sort_order ASC, created_at DESC";

  const [services] = await db.query(querySql);

  const formattedServices = services.map((s) => ({
    ...s,
    tags: parseTags(s.tags),
    is_home: Boolean(s.is_home),
    sort_order: Number(s.sort_order || 0),
  }));

  res.json(formattedServices);
});

exports.getServiceById = asyncHandler(async (req, res) => {
  const identifier = req.params.id;
  let services = [];

  if (/^\d+$/.test(identifier)) {
    [services] = await db.query("SELECT * FROM services WHERE id=?", [identifier]);
  } else {
    // Attempt slug match via slugified title or exact title match
    const slugParam = identifier.toLowerCase().trim();
    const [allServices] = await db.query("SELECT * FROM services");
    services = allServices.filter((s) => {
      const sSlug = (s.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return sSlug === slugParam || (s.title && s.title.toLowerCase() === slugParam);
    });
  }

  if (!services || services.length === 0) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }

  const service = services[0];
  res.json({
    ...service,
    tags: parseTags(service.tags),
    is_home: Boolean(service.is_home),
    sort_order: Number(service.sort_order || 0),
  });
});

exports.deleteService = asyncHandler(async (req, res) => {
  await db.query("DELETE FROM services WHERE id=?", [req.params.id]);

  res.json({
    success: true,
    message: "Service Deleted",
  });
});

exports.updateService = asyncHandler(async (req, res) => {
  const { title, icon, short_description, full_description, price, category_id, is_home, tags, sort_order } = req.body;
  const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : req.body.image;

  const isHomeVal = is_home !== undefined ? (is_home === true || is_home === "true" || is_home == 1 ? 1 : 0) : null;
  const sortOrderVal = sort_order !== undefined ? (parseInt(sort_order, 10) || 0) : null;
  const formattedTags = tags !== undefined ? JSON.stringify(parseTags(tags)) : null;

  await db.query(
    `UPDATE services 
     SET title = COALESCE(?, title), 
         icon = COALESCE(?, icon), 
         image = COALESCE(?, image), 
         short_description = COALESCE(?, short_description), 
         full_description = COALESCE(?, full_description), 
         price = COALESCE(?, price), 
         category_id = COALESCE(?, category_id),
         tags = COALESCE(?, tags),
         is_home = COALESCE(?, is_home),
         sort_order = COALESCE(?, sort_order)
     WHERE id = ?`,
    [title, icon, image, short_description, full_description, price, category_id, formattedTags, isHomeVal, sortOrderVal, req.params.id]
  );

  res.json({
    success: true,
    message: "Service Updated",
  });
});
