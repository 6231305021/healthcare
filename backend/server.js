const mysql = require("mysql2");

// Convert port เป็น number
const dbPort = parseInt(process.env.DB_PORT, 10);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: dbPort
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
  } else {
    console.log("✅ MySQL Connected!");
  }
});

// Example: start server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
