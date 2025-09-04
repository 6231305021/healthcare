import mysql from "mysql2/promise"; // ถ้าใช้ ES module
// const mysql = require("mysql2/promise"); // ถ้าใช้ CommonJS

const connection = await mysql.createConnection({
  host: "containers-us-west-123.railway.app",
  port: 3306,
  user: "root",
  password: "iuGIxHXlzLxiJkgZzlwrtEdrvgXaXcuS",
  database: "healthcare",
});

try {
  const [rows] = await connection.query("SHOW TABLES;");
  console.log("Tables:", rows);
  console.log("✅ Connection successful!");
} catch (err) {
  console.error("❌ Connection failed:", err);
} finally {
  await connection.end();
}
