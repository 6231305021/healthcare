// server.cjs
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// -------------------- Middleware --------------------
app.use(cors({ origin: "*" }));
app.use(express.json());

// -------------------- Routes (API) --------------------
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.get("/api", (req, res) => {
  db.query("SELECT NOW() AS now", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🚀 Backend API connected!", time: results[0].now });
  });
});

// -------------------- MySQL --------------------
const db = mysql.createConnection({
  host: process.env.DB_HOST || "mysql.railway.internal",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "iuGIxHXlzLxiJkgZzlwrtEdrvgXaXcuS",
  database: process.env.DB_NAME || "railway",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
  } else {
    console.log("✅ Connected to MySQL!");
  }
});

// -------------------- Serve Frontend --------------------
const distPath = path.join(__dirname, "dist");

// Debug log
console.log("📂 Serving frontend from:", distPath);

// 1. เสิร์ฟไฟล์ static (.js, .css, images, favicon)
app.use(express.static(distPath));

// 2. ถ้าไม่ใช่ไฟล์จริง → ส่ง index.html กลับ (Vue/React Router ใช้ทำงาน)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
