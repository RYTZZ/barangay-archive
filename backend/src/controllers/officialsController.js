const db = require('../config/database');
const { uploadToGCS, deleteFromGCS } = require('../config/cloudinary');

// ── GET /api/officials ────────────────────────────────────────────────────────
const getAllOfficials = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, position, committee, email, phone,
              photo_url, term_start, term_end, sort_order
       FROM officials
       WHERE is_active = 1
       ORDER BY sort_order ASC, id ASC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getAllOfficials:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch officials.' });
  }
};

// ── GET /api/officials/:id ────────────────────────────────────────────────────
const getOfficialById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM officials WHERE id = ?', [
      req.params.id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Official not found.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getOfficialById:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch official.' });
  }
};

// ── POST /api/officials ───────────────────────────────────────────────────────
const createOfficial = async (req, res) => {
  try {
    const { name, position, committee, email, phone, term_start, term_end, sort_order } =
      req.body;

    if (!name || !position) {
      return res.status(400).json({
        success: false,
        message: 'Name and position are required.',
      });
    }

    let photoData = {};
    if (req.file) {
      const uploaded = await uploadToGCS(req.file, 'officials');
      photoData = { photo_url: uploaded.url, photo_gcs_path: uploaded.gcsPath };
    }

    const [result] = await db.query(
      `INSERT INTO officials
         (name, position, committee, email, phone,
          photo_url, photo_gcs_path, term_start, term_end, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        position.trim(),
        committee || null,
        email || null,
        phone || null,
        photoData.photo_url || null,
        photoData.photo_gcs_path || null,
        term_start || null,
        term_end || null,
        sort_order != null ? parseInt(sort_order, 10) : 0,
      ]
    );

    const [[newRow]] = await db.query('SELECT * FROM officials WHERE id = ?', [
      result.insertId,
    ]);
    res
      .status(201)
      .json({ success: true, message: 'Official created.', data: newRow });
  } catch (err) {
    console.error('createOfficial:', err);
    res.status(500).json({ success: false, message: 'Failed to create official.' });
  }
};

// ── PUT /api/officials/:id ────────────────────────────────────────────────────
const updateOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, committee, email, phone, term_start, term_end, sort_order } =
      req.body;

    const [[existing]] = await db.query('SELECT * FROM officials WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Official not found.' });
    }

    let photoData = {
      photo_url: existing.photo_url,
      photo_gcs_path: existing.photo_gcs_path,
    };

    if (req.file) {
      if (existing.photo_gcs_path) await deleteFromGCS(existing.photo_gcs_path);
      const uploaded = await uploadToGCS(req.file, 'officials');
      photoData = { photo_url: uploaded.url, photo_gcs_path: uploaded.gcsPath };
    }

    await db.query(
      `UPDATE officials
       SET name = ?, position = ?, committee = ?, email = ?, phone = ?,
           photo_url = ?, photo_gcs_path = ?, term_start = ?, term_end = ?, sort_order = ?
       WHERE id = ?`,
      [
        name || existing.name,
        position || existing.position,
        committee !== undefined ? committee : existing.committee,
        email !== undefined ? email : existing.email,
        phone !== undefined ? phone : existing.phone,
        photoData.photo_url,
        photoData.photo_gcs_path,
        term_start !== undefined ? term_start : existing.term_start,
        term_end !== undefined ? term_end : existing.term_end,
        sort_order != null ? parseInt(sort_order, 10) : existing.sort_order,
        id,
      ]
    );

    const [[updated]] = await db.query('SELECT * FROM officials WHERE id = ?', [id]);
    res.json({ success: true, message: 'Official updated.', data: updated });
  } catch (err) {
    console.error('updateOfficial:', err);
    res.status(500).json({ success: false, message: 'Failed to update official.' });
  }
};

// ── DELETE /api/officials/:id ─────────────────────────────────────────────────
const deleteOfficial = async (req, res) => {
  try {
    const [[existing]] = await db.query('SELECT * FROM officials WHERE id = ?', [
      req.params.id,
    ]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Official not found.' });
    }

    if (existing.photo_gcs_path) await deleteFromGCS(existing.photo_gcs_path);
    await db.query('DELETE FROM officials WHERE id = ?', [req.params.id]);

    res.json({ success: true, message: 'Official deleted.' });
  } catch (err) {
    console.error('deleteOfficial:', err);
    res.status(500).json({ success: false, message: 'Failed to delete official.' });
  }
};

module.exports = {
  getAllOfficials,
  getOfficialById,
  createOfficial,
  updateOfficial,
  deleteOfficial,
};
