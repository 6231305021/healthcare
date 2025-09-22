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
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: parseInt(process.env.MYSQLPORT) || 3306, // MySQL port
});

db.connect((err) => {
  if (err) console.error("❌ MySQL Connection Failed:", err);
  else console.log("✅ Connected to MySQL!");
});

// -------------------- Routes --------------------
const authRoutes = require("./routes/auth");
const geocodeRoutes = require("./routes/geocode");
const dailyTrackingRoutes = require("./routes/dailyTracking");
const appointmentsRoutes = require("./routes/appointments");
const patientRoutes = require("./routes/patient");
const userRoutes = require("./routes/user");

app.use("/auth", authRoutes);
app.use("/geocode", geocodeRoutes);
app.use("/dailyTracking", dailyTrackingRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/patient", patientRoutes);
app.use("/user", userRoutes);

// -------------------- Test API --------------------
app.get("/api", (req, res) => {
  db.query("SELECT NOW() AS now", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🚀 Backend API connected!", time: results[0].now });
  });
});

// -------------------- Serve Frontend --------------------
const distPath = path.join(__dirname, "dist");
console.log("📂 Serving frontend from:", distPath);

app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV})`)
);
