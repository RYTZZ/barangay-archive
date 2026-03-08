const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'barangay_archive',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

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
