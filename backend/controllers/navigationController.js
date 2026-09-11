const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Helper function to check URL scheme and item_type consistency
function validateUrlAndType(url, itemType) {
  if (!url || typeof url !== "string") return;
  const cleanUrl = url.trim();

  // Reject dangerous schemes (if not stripped by sanitizer)
  if (/^(javascript|data|vbscript):/i.test(cleanUrl)) {
    throw new AppError("URL contains dangerous scheme (javascript:, data:, vbscript:)", 400);
  }

  const effectiveType = itemType || "route";

  if (effectiveType === "route") {
    if (!cleanUrl.startsWith("/")) {
      throw new AppError("URL for route item_type must be a relative path starting with '/' (e.g. /about or /services)", 400);
    }
  } else if (effectiveType === "hash") {
    if (!cleanUrl.includes("#")) {
      throw new AppError("URL for hash item_type must contain '#' (e.g. /services#game-development or #contact)", 400);
    }
  } else if (effectiveType === "external") {
    if (!/^(https?:|\/\/|mailto:|tel:)/i.test(cleanUrl)) {
      throw new AppError("URL for external item_type must be an absolute URL starting with http://, https://, mailto:, or tel:", 400);
    }
  }
}

// Helper function to check hierarchy rules
async function validateHierarchyRules(itemId, groupLocation, parentId) {
  const effectiveParentId = (parentId === undefined || parentId === "" || parentId === null || parentId === "null") ? null : parseInt(parentId, 10);

  // Rule 1: Footer items cannot have a parent
  if (groupLocation !== "header" && effectiveParentId !== null) {
    throw new AppError("Footer items cannot have a parent item", 400);
  }

  // If no parent_id is specified (top-level header or footer item), check if existing parent with children is changing location
  if (effectiveParentId === null) {
    if (itemId && groupLocation !== "header") {
      const [childRows] = await db.query(
        "SELECT COUNT(*) AS child_count FROM navigation_items WHERE parent_id = ?",
        [itemId]
      );
      if (childRows[0].child_count > 0) {
        throw new AppError("Cannot change group location of a header parent item that currently has children", 400);
      }
    }
    return;
  }

  // Rule 2: Self-parenting check
  if (itemId && parseInt(itemId, 10) === effectiveParentId) {
    throw new AppError("An item cannot be its own parent", 400);
  }

  // Rule 3: Parent item must exist
  const [parentRows] = await db.query(
    "SELECT id, group_location, parent_id FROM navigation_items WHERE id = ?",
    [effectiveParentId]
  );

  if (parentRows.length === 0) {
    throw new AppError("Parent item does not exist", 400);
  }

  const parentItem = parentRows[0];

  // Rule 4: Parent must belong to header group
  if (parentItem.group_location !== "header") {
    throw new AppError("Parent item must belong to the header group", 400);
  }

  // Rule 5: Parent itself cannot be a child (max 2 levels)
  if (parentItem.parent_id !== null) {
    throw new AppError("Submenus cannot be nested more than 2 levels deep (child of child is not allowed)", 400);
  }

  // Rule 6: An item that has children cannot itself become a child of another item
  if (itemId) {
    const [childRows] = await db.query(
      "SELECT COUNT(*) AS child_count FROM navigation_items WHERE parent_id = ?",
      [itemId]
    );
    if (childRows[0].child_count > 0) {
      throw new AppError("An item with children cannot be assigned a parent", 400);
    }
  }
}

// 1. PUBLIC API: GET /api/navigation
// Optional query: ?location=header|footer_quick|footer_legal
exports.getPublicNavigation = asyncHandler(async (req, res) => {
  const { location } = req.query;

  let query = `
    SELECT 
      id, group_location, parent_id, label, url, item_type, target, 
      icon_name, description, sort_order, is_active 
    FROM navigation_items 
    WHERE is_active = 1
  `;
  const params = [];

  if (location) {
    const loc = location.trim().toLowerCase();
    if (!["header", "footer_quick", "footer_legal"].includes(loc)) {
      throw new AppError("Invalid location parameter. Must be header, footer_quick, or footer_legal", 400);
    }
    query += " AND group_location = ?";
    params.push(loc);
  }

  query += " ORDER BY group_location ASC, sort_order ASC, id ASC";

  const [rows] = await db.query(query, params);

  res.json({
    success: true,
    count: rows.length,
    navigation: rows,
    data: rows
  });
});

// 2. ADMIN API: GET /api/navigation/admin
exports.getAdminNavigation = asyncHandler(async (req, res) => {
  const [rows] = await db.query(`
    SELECT 
      id, group_location, parent_id, label, url, item_type, target, 
      icon_name, description, sort_order, is_active, created_at, updated_at 
    FROM navigation_items 
    ORDER BY group_location ASC, sort_order ASC, id ASC
  `);

  res.json({
    success: true,
    count: rows.length,
    navigation: rows,
    data: rows
  });
});

// 3. ADMIN API: POST /api/navigation
exports.createNavigationItem = asyncHandler(async (req, res) => {
  const {
    group_location,
    parent_id,
    label,
    url,
    item_type = "route",
    target = "_self",
    icon_name = null,
    description = null,
    sort_order = 0,
    is_active = 1
  } = req.body;

  const cleanLocation = group_location ? group_location.trim() : "header";
  const cleanLabel = label ? label.trim() : "";
  const cleanUrl = url ? url.trim() : "";
  const cleanType = item_type ? item_type.trim() : "route";
  const cleanTarget = target ? target.trim() : "_self";
  const cleanIcon = icon_name ? icon_name.trim() : null;
  const cleanDesc = description ? description.trim() : null;
  const numSortOrder = sort_order !== undefined ? parseInt(sort_order, 10) : 0;
  const numIsActive = (is_active === true || is_active == 1 || is_active === "true") ? 1 : 0;
  const effectiveParentId = (parent_id === undefined || parent_id === "" || parent_id === null || parent_id === "null") ? null : parseInt(parent_id, 10);

  // Validate URL security & item type consistency
  validateUrlAndType(cleanUrl, cleanType);

  // Validate hierarchy rules
  await validateHierarchyRules(null, cleanLocation, effectiveParentId);

  const [result] = await db.query(
    `INSERT INTO navigation_items 
      (group_location, parent_id, label, url, item_type, target, icon_name, description, sort_order, is_active) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [cleanLocation, effectiveParentId, cleanLabel, cleanUrl, cleanType, cleanTarget, cleanIcon, cleanDesc, numSortOrder, numIsActive]
  );

  const newId = result.insertId;
  const [createdRows] = await db.query("SELECT * FROM navigation_items WHERE id = ?", [newId]);

  res.status(201).json({
    success: true,
    message: "Navigation item created successfully",
    data: createdRows[0]
  });
});

// 4. ADMIN API: PUT /api/navigation/:id
exports.updateNavigationItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new AppError("Invalid navigation item ID", 400);
  }

  const [existingRows] = await db.query("SELECT * FROM navigation_items WHERE id = ?", [numericId]);
  if (existingRows.length === 0) {
    throw new AppError("Navigation item not found", 404);
  }
  const existing = existingRows[0];

  const group_location = req.body.group_location !== undefined ? req.body.group_location.trim() : existing.group_location;
  const label = req.body.label !== undefined ? req.body.label.trim() : existing.label;
  const url = req.body.url !== undefined ? req.body.url.trim() : existing.url;
  const item_type = req.body.item_type !== undefined ? req.body.item_type.trim() : existing.item_type;
  const target = req.body.target !== undefined ? req.body.target.trim() : existing.target;
  const icon_name = req.body.icon_name !== undefined ? (req.body.icon_name ? req.body.icon_name.trim() : null) : existing.icon_name;
  const description = req.body.description !== undefined ? (req.body.description ? req.body.description.trim() : null) : existing.description;
  const sort_order = req.body.sort_order !== undefined ? parseInt(req.body.sort_order, 10) : existing.sort_order;
  const is_active = req.body.is_active !== undefined ? ((req.body.is_active === true || req.body.is_active == 1 || req.body.is_active === "true") ? 1 : 0) : existing.is_active;

  let parent_id = existing.parent_id;
  if (req.body.parent_id !== undefined) {
    parent_id = (req.body.parent_id === null || req.body.parent_id === "" || req.body.parent_id === "null") ? null : parseInt(req.body.parent_id, 10);
  }

  // Validate URL security & item type consistency
  validateUrlAndType(url, item_type);

  // Validate hierarchy rules
  await validateHierarchyRules(numericId, group_location, parent_id);

  await db.query(
    `UPDATE navigation_items SET 
      group_location = ?, parent_id = ?, label = ?, url = ?, item_type = ?, 
      target = ?, icon_name = ?, description = ?, sort_order = ?, is_active = ? 
     WHERE id = ?`,
    [group_location, parent_id, label, url, item_type, target, icon_name, description, sort_order, is_active, numericId]
  );

  const [updatedRows] = await db.query("SELECT * FROM navigation_items WHERE id = ?", [numericId]);

  res.json({
    success: true,
    message: "Navigation item updated successfully",
    data: updatedRows[0]
  });
});

// 5. ADMIN API: DELETE /api/navigation/:id
exports.deleteNavigationItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new AppError("Invalid navigation item ID", 400);
  }

  const [existingRows] = await db.query("SELECT * FROM navigation_items WHERE id = ?", [numericId]);
  if (existingRows.length === 0) {
    throw new AppError("Navigation item not found", 404);
  }

  // DELETE SAFETY: Check if item has children
  const [childRows] = await db.query("SELECT COUNT(*) AS child_count FROM navigation_items WHERE parent_id = ?", [numericId]);
  if (childRows[0].child_count > 0) {
    throw new AppError("Cannot delete navigation item that has children. Please delete or reassign child items first.", 400);
  }

  await db.query("DELETE FROM navigation_items WHERE id = ?", [numericId]);

  res.json({
    success: true,
    message: "Navigation item deleted successfully"
  });
});

// 6. ADMIN API: PATCH /api/navigation/:id/toggle
exports.toggleNavigationItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new AppError("Invalid navigation item ID", 400);
  }

  const [existingRows] = await db.query("SELECT * FROM navigation_items WHERE id = ?", [numericId]);
  if (existingRows.length === 0) {
    throw new AppError("Navigation item not found", 404);
  }

  const existing = existingRows[0];
  let newStatus;
  if (req.body && req.body.is_active !== undefined) {
    newStatus = (req.body.is_active === true || req.body.is_active == 1 || req.body.is_active === "true") ? 1 : 0;
  } else {
    newStatus = existing.is_active === 1 ? 0 : 1;
  }

  await db.query("UPDATE navigation_items SET is_active = ? WHERE id = ?", [newStatus, numericId]);

  const [updatedRows] = await db.query("SELECT * FROM navigation_items WHERE id = ?", [numericId]);

  res.json({
    success: true,
    message: `Navigation item ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
    data: updatedRows[0]
  });
});

// 7. ADMIN API: PATCH /api/navigation/reorder
exports.reorderNavigationItems = asyncHandler(async (req, res) => {
  let itemsList = req.body;
  if (req.body && Array.isArray(req.body.items)) {
    itemsList = req.body.items;
  }

  if (!Array.isArray(itemsList) || itemsList.length === 0) {
    throw new AppError("Reorder request body must contain a non-empty array of items", 400);
  }

  // Validate duplicate IDs
  const idSet = new Set();
  for (const item of itemsList) {
    const id = parseInt(item.id, 10);
    const sortOrder = parseInt(item.sort_order, 10);

    if (isNaN(id) || id <= 0) {
      throw new AppError("Each item in reorder request must have a valid positive integer id", 400);
    }
    if (isNaN(sortOrder) || sortOrder < 0) {
      throw new AppError("Each item in reorder request must have a valid non-negative sort_order", 400);
    }
    if (idSet.has(id)) {
      throw new AppError(`Duplicate item ID ${id} in reorder request`, 400);
    }
    idSet.add(id);
  }

  // Verify all IDs exist in database
  const requestedIds = Array.from(idSet);
  const [dbRows] = await db.query(
    `SELECT id, group_location, parent_id FROM navigation_items WHERE id IN (${requestedIds.map(() => "?").join(",")})`,
    requestedIds
  );

  if (dbRows.length !== requestedIds.length) {
    throw new AppError("One or more navigation items specified in reorder request do not exist", 404);
  }

  // Perform atomic transaction update
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    for (const item of itemsList) {
      const id = parseInt(item.id, 10);
      const sortOrder = parseInt(item.sort_order, 10);
      await conn.query("UPDATE navigation_items SET sort_order = ? WHERE id = ?", [sortOrder, id]);
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  const [allRows] = await db.query(
    "SELECT * FROM navigation_items ORDER BY group_location ASC, sort_order ASC, id ASC"
  );

  res.json({
    success: true,
    message: "Navigation items reordered successfully",
    data: allRows
  });
});
