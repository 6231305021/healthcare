// server.cjs
const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// -------------------- Middleware --------------------
app.use(cors({ origin: "*" }));
app.use(express.json());

// -------------------- MySQL --------------------
const db = mysql.createPool({
  host: process.env.DB_HOST || "mysql.railway.internal",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "iuGIxHXlzLxiJkgZzlwrtEdrvgXaXcuS",
  database: process.env.DB_NAME || "railway",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
});

// Test connection
db.getConnection()
  .then(() => console.log("✅ Connected to MySQL!"))
  .catch((err) => console.error("❌ MySQL connection error:", err));

// -------------------- Routes (API) --------------------
const authRoutes = require("./routes/auth")(db);
app.use("/api/auth", authRoutes);

// Example API
app.get("/api", async (req, res) => {
  try {
    const [results] = await db.query("SELECT NOW() AS now");
    res.json({ message: "🚀 Backend API connected!", time: results[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Serve Frontend --------------------
const distPath = path.join(__dirname, "dist");
console.log("📂 Serving frontend from:", distPath);

app.use(express.static(distPath));

// Catch-all (Vue Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
