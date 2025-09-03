const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🚀 Backend running on Railway!');
});

app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users'); // ตาราง users ต้องมีใน DB
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
