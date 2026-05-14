const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sharafs_sweets',
  password: 'admin123',
  port: 5432,
});

async function resetPassword() {
  const newPassword = 'Sharaf18!'; // ← change this
  const hashed = await bcrypt.hash(newPassword, 10);
  
  await pool.query(
    'UPDATE users SET password = $1 WHERE email = $2',
    [hashed, 'sharafssweets@gmail.com']
  );

  console.log('✅ Password updated successfully!');
  pool.end();
}

resetPassword();
