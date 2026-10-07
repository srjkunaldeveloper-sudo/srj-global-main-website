const db = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// Normalize features array / string
const normalizeFeatures = (input) => {
  if (!input || input === 'null' || input === 'undefined') return '[]';
  if (Array.isArray(input)) {
    const cleaned = input.map(item => String(item).trim()).filter(Boolean);
    return JSON.stringify(cleaned);
  }
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return '[]';
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.map(item => String(item).trim()).filter(Boolean);
          return JSON.stringify(cleaned);
        }
      } catch (e) {
        // Fallback
      }
    }
    const cleaned = trimmed.split(',').map(item => item.trim()).filter(Boolean);
    return JSON.stringify(cleaned);
  }
  return '[]';
};

const parseModel = (model) => {
  if (!model) return model;
  let features = [];
  try {
    features = typeof model.features === 'string' ? JSON.parse(model.features) : (model.features || []);
  } catch (e) {
    features = typeof model.features === 'string' ? model.features.split(',').map(f => f.trim()).filter(Boolean) : [];
  }
  return {
    ...model,
    features,
    is_active: Boolean(model.is_active)
  };
};

/**
 * @desc Get public active collaboration models
 * @route GET /api/collaboration
 * @access Public
 */
const getPublicCollaborationModels = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM collaboration_models WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
  );
  const data = rows.map(parseModel);
  res.json({
    success: true,
    count: data.length,
    data
  });
});

/**
 * @desc Get all collaboration models (admin view)
 * @route GET /api/collaboration/admin
 * @access Private/Admin
 */
const getAllCollaborationModels = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM collaboration_models ORDER BY sort_order ASC, id ASC'
  );
  const data = rows.map(parseModel);
  res.json({
    success: true,
    count: data.length,
    data
  });
});

/**
 * @desc Create new collaboration model
 * @route POST /api/collaboration
 * @access Private/Admin
 */
const createCollaborationModel = asyncHandler(async (req, res) => {
  const { title, description, icon, image, features, sort_order, is_active } = req.body;

  if (!title || !description) {
    throw new AppError('Title and description are required', 400);
  }

  const normalizedFeatures = normalizeFeatures(features);
  const finalSortOrder = Number.isInteger(Number(sort_order)) ? Number(sort_order) : 0;
  const finalIsActive = is_active !== undefined ? (is_active ? 1 : 0) : 1;
  const finalIcon = (icon && String(icon).trim()) || 'Lightbulb';
  const finalImage = (image && String(image).trim()) || null;

  const [result] = await db.query(
    'INSERT INTO collaboration_models (title, description, icon, image, features, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title.trim(), description.trim(), finalIcon, finalImage, normalizedFeatures, finalSortOrder, finalIsActive]
  );

  const [newRow] = await db.query('SELECT * FROM collaboration_models WHERE id = ?', [result.insertId]);

  res.status(201).json({
    success: true,
    message: 'Collaboration model created successfully',
    data: parseModel(newRow[0])
  });
});

/**
 * @desc Update collaboration model
 * @route PUT /api/collaboration/:id
 * @access Private/Admin
 */
const updateCollaborationModel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, icon, image, features, sort_order, is_active } = req.body;

  const [existing] = await db.query('SELECT * FROM collaboration_models WHERE id = ?', [id]);
  if (!existing || existing.length === 0) {
    throw new AppError('Collaboration model not found', 404);
  }

  const current = existing[0];
  const newTitle = title !== undefined ? String(title).trim() : current.title;
  const newDesc = description !== undefined ? String(description).trim() : current.description;
  const newIcon = icon !== undefined ? (String(icon).trim() || 'Lightbulb') : current.icon;
  const newImage = image !== undefined ? (String(image).trim() || null) : current.image;
  const newFeatures = features !== undefined ? normalizeFeatures(features) : current.features;
  const newSortOrder = sort_order !== undefined ? Number(sort_order) : current.sort_order;
  const newIsActive = is_active !== undefined ? (is_active ? 1 : 0) : current.is_active;

  await db.query(
    'UPDATE collaboration_models SET title = ?, description = ?, icon = ?, image = ?, features = ?, sort_order = ?, is_active = ? WHERE id = ?',
    [newTitle, newDesc, newIcon, newImage, newFeatures, newSortOrder, newIsActive, id]
  );

  const [updated] = await db.query('SELECT * FROM collaboration_models WHERE id = ?', [id]);

  res.json({
    success: true,
    message: 'Collaboration model updated successfully',
    data: parseModel(updated[0])
  });
});

/**
 * @desc Delete collaboration model
 * @route DELETE /api/collaboration/:id
 * @access Private/Admin
 */
const deleteCollaborationModel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existing] = await db.query('SELECT id FROM collaboration_models WHERE id = ?', [id]);
  if (!existing || existing.length === 0) {
    throw new AppError('Collaboration model not found', 404);
  }

  await db.query('DELETE FROM collaboration_models WHERE id = ?', [id]);

  res.json({
    success: true,
    message: 'Collaboration model deleted successfully'
  });
});

module.exports = {
  getPublicCollaborationModels,
  getAllCollaborationModels,
  createCollaborationModel,
  updateCollaborationModel,
  deleteCollaborationModel
};
