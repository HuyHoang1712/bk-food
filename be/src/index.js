const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 4000; 

// Cấu hình Middleware
app.use(cors()); // Cho phép Frontend gọi
app.use(express.json()); // Cho phép đọc dữ liệu JSON gửi lên

// Tạo một đường dẫn test (Route)
app.get('/', (req, res) => {
  res.send('Xin chào! Đây là Backend của BK-FOOD 🍜');
});

// Chạy server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
});