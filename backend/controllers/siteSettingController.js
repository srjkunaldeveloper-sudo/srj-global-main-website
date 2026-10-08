const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Helper to normalize settings key-value input from request body
function extractKeyValuePairs(reqBody) {
  let pairs = {};

  if (reqBody.settings && typeof reqBody.settings === "object") {
    if (Array.isArray(reqBody.settings)) {
      reqBody.settings.forEach((item) => {
        if (item && item.key) {
          const val = item.value !== undefined ? item.value : item.setting_value;
          pairs[item.key] = val !== undefined ? val : null;
        }
      });
    } else {
      pairs = { ...reqBody.settings };
    }
  } else {
    // Direct key-value map in reqBody (excluding any metadata properties)
    pairs = { ...reqBody };
  }

  return pairs;
}

// Field type validator helper
function validateFieldValue(key, fieldType, cleanVal) {
  if (cleanVal === null || cleanVal.length === 0) return;

  if (fieldType === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanVal)) {
      throw new AppError(`Invalid email format for key '${key}'`, 400);
    }
  } else if (fieldType === "url") {
    const isAnchorOrSpecial =
      cleanVal === "#" ||
      cleanVal.startsWith("#") ||
      cleanVal.startsWith("mailto:") ||
      cleanVal.startsWith("tel:");
    const isRelativeUrl = cleanVal.startsWith("/");
    const isAbsoluteUrl = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(cleanVal);
    if (!isAnchorOrSpecial && !isRelativeUrl && !isAbsoluteUrl) {
      throw new AppError(`Invalid URL format for key '${key}'`, 400);
    }
  } else if (fieldType === "phone") {
    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(cleanVal)) {
      throw new AppError(`Invalid phone number format for key '${key}'`, 400);
    }
  }
}

// Public API: Safe-read site settings
// Accepts optional ?group=query filter (e.g. GET /api/settings?group=contact)
exports.getPublicSettings = asyncHandler(async (req, res) => {
  const { group } = req.query;

  let query = "SELECT setting_key, setting_value, group_name, field_type FROM site_settings";
  const params = [];

  if (group && typeof group === "string") {
    query += " WHERE group_name = ?";
    params.push(group.trim().toLowerCase());
  }

  query += " ORDER BY group_name, setting_key";

  const [rows] = await db.query(query, params);

  const settingsMap = {};
  const groupsMap = {};

  rows.forEach((row) => {
    const key = row.setting_key;
    const value = row.setting_value;
    const grp = row.group_name;

    settingsMap[key] = value;

    if (!groupsMap[grp]) {
      groupsMap[grp] = {};
    }
    groupsMap[grp][key] = value;
  });

  res.json({
    success: true,
    settings: settingsMap,
    groups: groupsMap,
  });
});

// Admin API: Get all site settings with full metadata
exports.getAdminSettings = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, setting_key, setting_value, group_name, field_type, description, created_at, updated_at FROM site_settings ORDER BY group_name, setting_key"
  );

  const groupsMap = {};

  rows.forEach((row) => {
    const group = row.group_name;
    if (!groupsMap[group]) {
      groupsMap[group] = [];
    }
    groupsMap[group].push(row);
  });

  res.json({
    success: true,
    count: rows.length,
    settings: rows,
    groups: groupsMap,
  });
});

// Admin API: Update single setting by key
exports.updateSettingByKey = asyncHandler(async (req, res) => {
  const { key } = req.params;

  // Extract setting_value or value from body
  const rawValue = req.body.value !== undefined ? req.body.value : req.body.setting_value;

  if (rawValue === undefined) {
    throw new AppError("A 'value' or 'setting_value' field is required in request body", 400);
  }

  const newValue = rawValue !== null ? String(rawValue).trim() : null;

  // Check if key exists in database
  const [existingRows] = await db.query(
    "SELECT * FROM site_settings WHERE setting_key = ?",
    [key]
  );

  if (existingRows.length === 0) {
    // Auto-create setting if it didn't exist before
    const defaultGroup = key.startsWith('footer_') ? 'footer'
      : key.startsWith('legal_') || key.startsWith('privacy_') || key.startsWith('terms_') || key.startsWith('cookie_') ? 'legal'
      : key.startsWith('seo_') || key.startsWith('geo_') ? 'seo'
      : key.startsWith('social_') ? 'social'
      : key.startsWith('contact_') ? 'contact'
      : 'general';

    await db.query(
      "INSERT INTO site_settings (setting_key, setting_value, group_name, field_type, description) VALUES (?, ?, ?, 'text', ?)",
      [key, newValue, defaultGroup, `Dynamic setting for ${key}`]
    );
  } else {
    const existingSetting = existingRows[0];
    validateFieldValue(key, existingSetting.field_type, newValue);
    await db.query(
      "UPDATE site_settings SET setting_value = ? WHERE setting_key = ?",
      [newValue, key]
    );
  }

  const [updatedRows] = await db.query(
    "SELECT id, setting_key, setting_value, group_name, field_type, description, updated_at FROM site_settings WHERE setting_key = ?",
    [key]
  );

  res.json({
    success: true,
    message: `Setting '${key}' updated successfully`,
    setting: updatedRows[0],
  });
});

// Admin API: Bulk update multiple settings
exports.updateBulkSettings = asyncHandler(async (req, res) => {
  const inputPairs = extractKeyValuePairs(req.body);
  const inputKeys = Object.keys(inputPairs);

  if (inputKeys.length === 0) {
    throw new AppError("No setting key-value pairs provided for update", 400);
  }

  // Fetch all existing settings to validate keys
  const [existingRows] = await db.query(
    "SELECT id, setting_key, field_type, group_name FROM site_settings"
  );
  const existingKeyMap = new Map(existingRows.map((r) => [r.setting_key, r]));

  const validUpdates = [];

  for (const key of inputKeys) {
    const existing = existingKeyMap.get(key);
    const rawVal = inputPairs[key];
    const cleanVal = rawVal !== null && rawVal !== undefined ? String(rawVal).trim() : null;

    if (existing) {
      validateFieldValue(key, existing.field_type, cleanVal);
      await db.query(
        "UPDATE site_settings SET setting_value = ? WHERE setting_key = ?",
        [cleanVal, key]
      );
    } else {
      // Auto-upsert new keys cleanly
      const inferredGroup =
        key.startsWith("footer_") ? "footer" :
        key.startsWith("legal_") || key.startsWith("privacy_") || key.startsWith("terms_") || key.startsWith("cookie_") ? "legal" :
        key.startsWith("seo_") || key.startsWith("geo_") ? "seo" :
        key.startsWith("social_") ? "social" :
        key.startsWith("contact_") ? "contact" :
        key.startsWith("home_") || key.startsWith("hero_") ? "home" :
        "general";

      await db.query(
        "INSERT INTO site_settings (setting_key, setting_value, group_name, field_type, description) VALUES (?, ?, ?, 'text', ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        [key, cleanVal, inferredGroup, `Custom setting ${key}`]
      );
    }

    validUpdates.push({ key, value: cleanVal });
  }

  // Fetch fresh public settings map
  const [freshRows] = await db.query(
    "SELECT setting_key, setting_value, group_name FROM site_settings ORDER BY group_name, setting_key"
  );

  const updatedSettingsMap = {};
  freshRows.forEach((r) => {
    updatedSettingsMap[r.setting_key] = r.setting_value;
  });

  res.json({
    success: true,
    message: `Successfully updated ${validUpdates.length} setting(s)`,
    updatedCount: validUpdates.length,
    updatedKeys: validUpdates.map((u) => u.key),
    settings: updatedSettingsMap,
  });
});
