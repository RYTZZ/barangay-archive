const mysql = require('mysql2/promise');

// Support Railway's native MySQL plugin env vars (MYSQLHOST etc.)
// as well as our own DB_* vars, with localhost fallback for local dev.
const dbConfig = {
  host:     process.env.DB_HOST     || process.env.MYSQLHOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10),
  user:     process.env.DB_USER     || process.env.MYSQLUSER     || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
  database: process.env.DB_NAME     || process.env.MYSQLDATABASE || 'barangay_archive',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
};

const pool = mysql.createPool(dbConfig);

// Verify connection on startup
pool
  .getConnection()
  .then((conn) => {
    console.log('✅  MySQL connected:', process.env.DB_NAME || 'barangay_archive');
    conn.release();
  })
  .catch((err) => {
    console.error('❌  MySQL connection failed:', err.message);
  });

module.exports = pool;
