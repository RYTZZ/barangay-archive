const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllOfficials,
  getOfficialById,
  createOfficial,
  updateOfficial,
  deleteOfficial,
} = require('../controllers/officialsController');

router.get('/', getAllOfficials);
router.get('/:id', getOfficialById);
router.post('/', upload.single('photo'), createOfficial);
router.put('/:id', upload.single('photo'), updateOfficial);
router.delete('/:id', deleteOfficial);

module.exports = router;
