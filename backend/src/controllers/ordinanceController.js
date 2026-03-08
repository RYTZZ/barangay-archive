const db = require('../config/database');
const { uploadToGCS, deleteFromGCS } = require('../config/cloudinary');

// ── GET /api/ordinances ───────────────────────────────────────────────────────
const getAllOrdinances = async (req, res) => {
  try {
    const { search, category, year, page = 1, limit = 12 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const conditions = ['status = "active"'];
    const params = [];

    if (search) {
      conditions.push('(title LIKE ? OR ordinance_number LIKE ? OR description LIKE ?)');
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (year) {
      conditions.push('YEAR(date_passed) = ?');
      params.push(parseInt(year, 10));
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM ordinances ${where}`,
      params
    );

    const [rows] = await db.query(
      `SELECT id, ordinance_number, title, description, full_text, date_passed,
              file_url, file_name, file_type, category, created_at
       FROM ordinances
       ${where}
       ORDER BY date_passed DESC, id DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('getAllOrdinances:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch ordinances.' });
  }
};

// ── GET /api/ordinances/categories ───────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT DISTINCT category FROM ordinances WHERE status = "active" ORDER BY category'
    );
    res.json({ success: true, data: rows.map((r) => r.category) });
  } catch (err) {
    console.error('getCategories:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

// ── GET /api/ordinances/:id ───────────────────────────────────────────────────
const getOrdinanceById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ordinances WHERE id = ?', [
      req.params.id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Ordinance not found.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getOrdinanceById:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch ordinance.' });
  }
};

// ── POST /api/ordinances ──────────────────────────────────────────────────────
const createOrdinance = async (req, res) => {
  try {
    const { ordinance_number, title, description, full_text, date_passed, category } =
      req.body;

    if (!ordinance_number || !title || !date_passed) {
      return res.status(400).json({
        success: false,
        message: 'Ordinance number, title, and date passed are required.',
      });
    }

    let fileData = {};
    if (req.file) {
      const uploaded = await uploadToGCS(req.file, 'ordinances');
      fileData = {
        file_url: uploaded.url,
        file_name: uploaded.fileName,
        file_type: uploaded.fileType,
        gcs_path: uploaded.gcsPath,
      };
    }

    const [result] = await db.query(
      `INSERT INTO ordinances
         (ordinance_number, title, description, full_text, date_passed, category,
          file_url, file_name, file_type, gcs_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ordinance_number.trim(),
        title.trim(),
        description || null,
        full_text || null,
        date_passed,
        category || 'General',
        fileData.file_url || null,
        fileData.file_name || null,
        fileData.file_type || null,
        fileData.gcs_path || null,
      ]
    );

    const [[newRow]] = await db.query('SELECT * FROM ordinances WHERE id = ?', [
      result.insertId,
    ]);

    res.status(201).json({
      success: true,
      message: 'Ordinance created successfully.',
      data: newRow,
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'An ordinance with this number already exists.',
      });
    }
    console.error('createOrdinance:', err);
    res.status(500).json({ success: false, message: 'Failed to create ordinance.' });
  }
};

// ── PUT /api/ordinances/:id ───────────────────────────────────────────────────
const updateOrdinance = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, full_text, date_passed, category } = req.body;

    const [[existing]] = await db.query('SELECT * FROM ordinances WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Ordinance not found.' });
    }

    let fileData = {
      file_url: existing.file_url,
      file_name: existing.file_name,
      file_type: existing.file_type,
      gcs_path: existing.gcs_path,
    };

    if (req.file) {
      if (existing.gcs_path) await deleteFromGCS(existing.gcs_path);
      const uploaded = await uploadToGCS(req.file, 'ordinances');
      fileData = {
        file_url: uploaded.url,
        file_name: uploaded.fileName,
        file_type: uploaded.fileType,
        gcs_path: uploaded.gcsPath,
      };
    }

    await db.query(
      `UPDATE ordinances
       SET title = ?, description = ?, full_text = ?, date_passed = ?, category = ?,
           file_url = ?, file_name = ?, file_type = ?, gcs_path = ?
       WHERE id = ?`,
      [
        title || existing.title,
        description !== undefined ? description : existing.description,
        full_text !== undefined ? full_text : existing.full_text,
        date_passed || existing.date_passed,
        category || existing.category,
        fileData.file_url,
        fileData.file_name,
        fileData.file_type,
        fileData.gcs_path,
        id,
      ]
    );

    const [[updated]] = await db.query('SELECT * FROM ordinances WHERE id = ?', [id]);
    res.json({ success: true, message: 'Ordinance updated.', data: updated });
  } catch (err) {
    console.error('updateOrdinance:', err);
    res.status(500).json({ success: false, message: 'Failed to update ordinance.' });
  }
};

// ── DELETE /api/ordinances/:id ────────────────────────────────────────────────
const deleteOrdinance = async (req, res) => {
  try {
    const [[existing]] = await db.query('SELECT * FROM ordinances WHERE id = ?', [
      req.params.id,
    ]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Ordinance not found.' });
    }

    if (existing.gcs_path) await deleteFromGCS(existing.gcs_path);
    await db.query('DELETE FROM ordinances WHERE id = ?', [req.params.id]);

    res.json({ success: true, message: 'Ordinance deleted.' });
  } catch (err) {
    console.error('deleteOrdinance:', err);
    res.status(500).json({ success: false, message: 'Failed to delete ordinance.' });
  }
};

module.exports = {
  getAllOrdinances,
  getCategories,
  getOrdinanceById,
  createOrdinance,
  updateOrdinance,
  deleteOrdinance,
};
