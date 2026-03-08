const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password';

function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Unauthorized' });
}

function loginAdmin(req, res) {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.admin = true;
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
}

function logoutAdmin(req, res) {
  req.session.destroy(() => {
    res.json({ success: true });
  });
}

module.exports = { requireAdmin, loginAdmin, logoutAdmin };
