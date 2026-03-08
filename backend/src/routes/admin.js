const express = require('express');
const router = express.Router();
const db = require('../config/database');
const upload = require('../middleware/upload');
const { requireAdmin } = require('../middleware/auth');
const {
  getAllOrdinances,
  getOrdinanceById,
  createOrdinance,
  updateOrdinance,
  deleteOrdinance
} = require('../controllers/ordinanceController');

// Stats endpoint
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM ordinances');
    const [[last]] = await db.query('SELECT MAX(date_passed) AS lastUpload FROM ordinances');
    res.json({
      totalOrdinances: total,
      lastUpload: last.lastUpload
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats.' });
  }
});

// CRUD endpoints for admin
router.get('/ordinances', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, title, date_passed AS date, file_url AS fileUrl FROM ordinances ORDER BY date_passed DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ordinances.' });
  }
});

router.get('/ordinances/:id', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, title, date_passed AS date, file_url AS fileUrl FROM ordinances WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ordinance.' });
  }
});

router.post('/ordinances', requireAdmin, upload.single('file'), async (req, res) => {
  // Use createOrdinance from controller
  return createOrdinance(req, res);
});

router.put('/ordinances', requireAdmin, upload.single('file'), async (req, res) => {
  // Use updateOrdinance from controller
  return updateOrdinance(req, res);
});

router.delete('/ordinances/:id', requireAdmin, async (req, res) => {
  // Use deleteOrdinance from controller
  return deleteOrdinance(req, res);
});

module.exports = router;
