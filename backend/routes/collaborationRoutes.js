const express = require('express');
const router = express.Router();

const {
  getPublicCollaborationModels,
  getAllCollaborationModels,
  createCollaborationModel,
  updateCollaborationModel,
  deleteCollaborationModel
} = require('../controllers/collaborationController');

const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// Public route to get active models
router.get('/', getPublicCollaborationModels);

// Admin route to get all models
router.get('/admin', verifyToken, isAdmin, getAllCollaborationModels);

// Admin mutations
router.post('/', verifyToken, isAdmin, createCollaborationModel);
router.put('/:id', verifyToken, isAdmin, updateCollaborationModel);
router.delete('/:id', verifyToken, isAdmin, deleteCollaborationModel);

module.exports = router;
