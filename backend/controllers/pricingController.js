const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const parseFeatures = (features) => {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  if (typeof features === "string") {
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return features.split("\n").map((f) => f.trim()).filter(Boolean);
    }
  }
  return [];
};

// PUBLIC: Get active plans and add-ons for the website
exports.getPublicPricing = asyncHandler(async (req, res) => {
  const [plans] = await db.query(
    "SELECT * FROM pricing_plans WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
  );
  const [addOns] = await db.query(
    "SELECT * FROM pricing_addons WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
  );

  const formattedPlans = plans.map((p) => ({
    ...p,
    displayName: p.display_name,
    priceDisplay: p.price_display,
    pricingLabel: p.pricing_label,
    ctaText: p.cta_text,
    features: parseFeatures(p.features),
    is_popular: Boolean(p.is_popular),
    is_active: Boolean(p.is_active),
    path: `/pricing/${p.name.toLowerCase()}`
  }));

  const formattedAddons = addOns.map((a) => ({
    ...a,
    priceDisplay: a.price_display,
    is_active: Boolean(a.is_active)
  }));

  res.json({
    success: true,
    plans: formattedPlans,
    addOns: formattedAddons
  });
});

// ADMIN: Get all plans (including inactive)
exports.getAllPlans = asyncHandler(async (req, res) => {
  const [plans] = await db.query(
    "SELECT * FROM pricing_plans ORDER BY sort_order ASC, id ASC"
  );

  const formatted = plans.map((p) => ({
    ...p,
    features: parseFeatures(p.features),
    is_popular: Boolean(p.is_popular),
    is_active: Boolean(p.is_active)
  }));

  res.json({
    success: true,
    plans: formatted
  });
});

// ADMIN: Create a new plan
exports.createPlan = asyncHandler(async (req, res) => {
  const {
    name,
    display_name,
    price_display,
    pricing_label,
    cta_text,
    description,
    features,
    badge,
    is_popular,
    sort_order,
    is_active
  } = req.body;

  if (!name || !display_name || !price_display) {
    throw new AppError("Name, Display Name, and Price are required", 400);
  }

  const formattedFeatures = JSON.stringify(parseFeatures(features));
  const isPopVal = is_popular === true || is_popular === 1 || is_popular === "true" || is_popular === "1" ? 1 : 0;
  const isActVal = is_active === false || is_active === 0 || is_active === "false" || is_active === "0" ? 0 : 1;
  const sortVal = parseInt(sort_order, 10) || 0;

  const [result] = await db.query(
    `INSERT INTO pricing_plans
    (name, display_name, price_display, pricing_label, cta_text, description, features, badge, is_popular, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name.trim(),
      display_name.trim(),
      price_display.trim(),
      (pricing_label || "Estimated Investment").trim(),
      (cta_text || "Discuss Your Project").trim(),
      description || "",
      formattedFeatures,
      badge ? badge.trim() : null,
      isPopVal,
      sortVal,
      isActVal
    ]
  );

  res.status(201).json({
    success: true,
    message: "Pricing plan created successfully",
    id: result.insertId
  });
});

// ADMIN: Update existing plan
exports.updatePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    display_name,
    price_display,
    pricing_label,
    cta_text,
    description,
    features,
    badge,
    is_popular,
    sort_order,
    is_active
  } = req.body;

  const [existing] = await db.query("SELECT id FROM pricing_plans WHERE id = ?", [id]);
  if (!existing || existing.length === 0) {
    throw new AppError("Pricing plan not found", 404);
  }

  const formattedFeatures = features !== undefined ? JSON.stringify(parseFeatures(features)) : undefined;
  const isPopVal = is_popular !== undefined ? (is_popular === true || is_popular === 1 || is_popular === "true" || is_popular === "1" ? 1 : 0) : undefined;
  const isActVal = is_active !== undefined ? (is_active === false || is_active === 0 || is_active === "false" || is_active === "0" ? 0 : 1) : undefined;
  const sortVal = sort_order !== undefined ? (parseInt(sort_order, 10) || 0) : undefined;

  const updates = [];
  const params = [];

  if (name !== undefined) { updates.push("name = ?"); params.push(name.trim()); }
  if (display_name !== undefined) { updates.push("display_name = ?"); params.push(display_name.trim()); }
  if (price_display !== undefined) { updates.push("price_display = ?"); params.push(price_display.trim()); }
  if (pricing_label !== undefined) { updates.push("pricing_label = ?"); params.push(pricing_label.trim()); }
  if (cta_text !== undefined) { updates.push("cta_text = ?"); params.push(cta_text.trim()); }
  if (description !== undefined) { updates.push("description = ?"); params.push(description); }
  if (formattedFeatures !== undefined) { updates.push("features = ?"); params.push(formattedFeatures); }
  if (badge !== undefined) { updates.push("badge = ?"); params.push(badge ? badge.trim() : null); }
  if (isPopVal !== undefined) { updates.push("is_popular = ?"); params.push(isPopVal); }
  if (sortVal !== undefined) { updates.push("sort_order = ?"); params.push(sortVal); }
  if (isActVal !== undefined) { updates.push("is_active = ?"); params.push(isActVal); }

  if (updates.length > 0) {
    params.push(id);
    await db.query(`UPDATE pricing_plans SET ${updates.join(", ")} WHERE id = ?`, params);
  }

  res.json({
    success: true,
    message: "Pricing plan updated successfully"
  });
});

// ADMIN: Delete a plan
exports.deletePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [result] = await db.query("DELETE FROM pricing_plans WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    throw new AppError("Pricing plan not found", 404);
  }

  res.json({
    success: true,
    message: "Pricing plan deleted successfully"
  });
});

// ADMIN: Get all add-ons
exports.getAllAddons = asyncHandler(async (req, res) => {
  const [addOns] = await db.query(
    "SELECT * FROM pricing_addons ORDER BY sort_order ASC, id ASC"
  );

  const formatted = addOns.map((a) => ({
    ...a,
    is_active: Boolean(a.is_active)
  }));

  res.json({
    success: true,
    addOns: formatted
  });
});

// ADMIN: Create an add-on
exports.createAddon = asyncHandler(async (req, res) => {
  const { name, price_display, description, sort_order, is_active } = req.body;

  if (!name || !price_display) {
    throw new AppError("Name and Price are required", 400);
  }

  const isActVal = is_active === false || is_active === 0 || is_active === "false" || is_active === "0" ? 0 : 1;
  const sortVal = parseInt(sort_order, 10) || 0;

  const [result] = await db.query(
    `INSERT INTO pricing_addons (name, price_display, description, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?)`,
    [name.trim(), price_display.trim(), description || "", sortVal, isActVal]
  );

  res.status(201).json({
    success: true,
    message: "Add-on created successfully",
    id: result.insertId
  });
});

// ADMIN: Update an add-on
exports.updateAddon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price_display, description, sort_order, is_active } = req.body;

  const [existing] = await db.query("SELECT id FROM pricing_addons WHERE id = ?", [id]);
  if (!existing || existing.length === 0) {
    throw new AppError("Add-on not found", 404);
  }

  const updates = [];
  const params = [];

  if (name !== undefined) { updates.push("name = ?"); params.push(name.trim()); }
  if (price_display !== undefined) { updates.push("price_display = ?"); params.push(price_display.trim()); }
  if (description !== undefined) { updates.push("description = ?"); params.push(description); }
  if (sort_order !== undefined) { updates.push("sort_order = ?"); params.push(parseInt(sort_order, 10) || 0); }
  if (is_active !== undefined) {
    updates.push("is_active = ?");
    params.push(is_active === false || is_active === 0 || is_active === "false" || is_active === "0" ? 0 : 1);
  }

  if (updates.length > 0) {
    params.push(id);
    await db.query(`UPDATE pricing_addons SET ${updates.join(", ")} WHERE id = ?`, params);
  }

  res.json({
    success: true,
    message: "Add-on updated successfully"
  });
});

// ADMIN: Delete an add-on
exports.deleteAddon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [result] = await db.query("DELETE FROM pricing_addons WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    throw new AppError("Add-on not found", 404);
  }

  res.json({
    success: true,
    message: "Add-on deleted successfully"
  });
});
