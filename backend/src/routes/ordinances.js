const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllOrdinances,
  getCategories,
  getOrdinanceById,
  createOrdinance,
  updateOrdinance,
  deleteOrdinance,
} = require('../controllers/ordinanceController');

// Note: /categories MUST come before /:id so Express doesn't treat "categories" as an id
router.get('/categories', getCategories);
router.get('/', getAllOrdinances);
router.get('/:id', getOrdinanceById);
router.post('/', upload.single('file'), createOrdinance);
router.put('/:id', upload.single('file'), updateOrdinance);
router.delete('/:id', deleteOrdinance);

module.exports = router;
