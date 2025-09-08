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

// -------------------- MySQL --------------------
const db = mysql.createConnection({
  host: process.env.DB_HOST || "mysql.railway.internal",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "your_password_here",
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

// -------------------- Routes (API) --------------------
const authRoutes = require("./routes/auth");
const geocodeRoutes = require('./routes/geocode');
const dailyTrackingRoutes = require('./routes/dailyTracking');
const appointmentsRoutes = require('./routes/appointments');
const patientRoutes = require('./routes/patient');
const userRoutes = require('./routes/user');

// Auth
app.use("/auth", authRoutes);

// Other API routes
app.use("/geocode", geocodeRoutes);
app.use("/dailyTracking", dailyTrackingRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/patient", patientRoutes);
app.use("/user", userRoutes);

// Test API
app.get("/api", (req, res) => {
  db.query("SELECT NOW() AS now", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🚀 Backend API connected!", time: results[0].now });
  });
});

// -------------------- Serve Frontend --------------------
const distPath = path.join(__dirname, "frontend", "dist"); // 👈 ถ้า frontend อยู่ในโฟลเดอร์ frontend
console.log("📂 Serving frontend from:", distPath);

app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
