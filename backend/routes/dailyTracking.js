// routes/dailyTracking.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // ใช้ db จาก server.cjs

// GET daily tracking ของผู้ป่วยรายคน
router.get('/patient/:patientId', async (req, res) => {
  const { patientId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT id, patient_id, temperature, blood_pressure_systolic, blood_pressure_diastolic,
              pulse_rate, respiratory_rate, blood_sugar, recorded_at
       FROM daily_tracking
       WHERE patient_id = ?
       ORDER BY recorded_at DESC`,
      [patientId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching daily tracking:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

// GET daily tracking พร้อม filter by date range
router.get('/:patientId', async (req, res) => {
  const { patientId } = req.params;
  const { startDate, endDate } = req.query;

  let query = 'SELECT * FROM daily_tracking WHERE patient_id = ?';
  const params = [patientId];

  if (startDate) {
    query += ' AND recorded_at >= ?';
    params.push(`${startDate} 00:00:00`);
  }
  if (endDate) {
    query += ' AND recorded_at <= ?';
    params.push(`${endDate} 23:59:59`);
  }

  query += ' ORDER BY recorded_at ASC';

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching daily tracking data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST daily tracking
router.post('/', async (req, res) => {
  const {
    patient_id,
    temperature,
    blood_pressure_systolic,
    blood_pressure_diastolic,
    pulse_rate,
    respiratory_rate,
    blood_sugar,
    recorded_at
  } = req.body;

  if (!patient_id || !recorded_at || !temperature || !blood_pressure_systolic || !blood_pressure_diastolic) {
    return res.status(400).json({ message: 'Patient ID, Recorded At, Temperature, Systolic BP, and Diastolic BP are required.' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO daily_tracking
       (patient_id, temperature, blood_pressure_systolic, blood_pressure_diastolic, pulse_rate, respiratory_rate, blood_sugar, recorded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        temperature,
        blood_pressure_systolic,
        blood_pressure_diastolic,
        pulse_rate,
        respiratory_rate,
        blood_sugar,
        recorded_at
      ]
    );
    res.status(201).json({ message: 'Daily tracking data added successfully', id: result.insertId });
  } catch (err) {
    console.error('Error adding daily tracking data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
