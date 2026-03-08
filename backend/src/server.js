require('dotenv').config();
const app = require('./app');

const PORT = parseInt(process.env.PORT, 10) || 5000;

app.listen(PORT, () => {
  console.log(`\n🏛  Barangay Zone 2 Ordinance Archive API`);
  console.log(`   Server  : http://localhost:${PORT}`);
  console.log(`   Env     : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health  : http://localhost:${PORT}/api/health\n`);
});
