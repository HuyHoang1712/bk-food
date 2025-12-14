// be/src/config/database.js
const mysql = require('mysql2');
require('dotenv').config(); // Nạp biến môi trường từ file .env

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',      
  password: process.env.DB_PASSWORD || '',  
  database: process.env.DB_NAME || 'BKFOOD',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. Kiểm tra kết nối thử một phát xem sao (Optional)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Kết nối Database thất bại:', err.message);
  } else {
    console.log('✅ Kết nối Database thành công!');
    connection.release(); // Trả kết nối về hồ bơi
  }
});

// 3. Xuất ra dạng Promise (để dùng được await db.query...)
module.exports = pool.promise();