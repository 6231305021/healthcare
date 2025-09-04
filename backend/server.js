// server.js
import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// สร้าง pool สำหรับเชื่อมต่อ MySQL
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // 10 วินาที
});

// ทดสอบการเชื่อมต่อ
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected!");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err);
  }
}

testConnection();

// ตัวอย่าง route
app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
