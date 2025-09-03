// โหลดค่า environment variables
require('dotenv').config(); // โหลด .env

const express = require('express');
const mysql = require('mysql2');

const app = express();

// ตั้งค่า port จาก environment หรือ fallback เป็น 3001
const PORT = process.env.PORT || 3001;

// เชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10)
});

// ตรวจสอบการเชื่อมต่อ
db.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Failed:', err);
  } else {
    console.log('✅ MySQL Connected!');
  }
});

// Middleware สำหรับ parse JSON
app.use(express.json());

// ตัวอย่าง route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ตัวอย่าง API แสดง table patients
app.get('/api/patients', (req, res) => {
  db.query('SELECT * FROM patients', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
