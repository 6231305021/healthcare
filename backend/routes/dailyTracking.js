const express = require('express');
const router = express.Router();
const pool = require('../db');

// ดึงข้อมูล daily tracking ของผู้ป่วยรายคน
router.get('/patient/:patientId', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const [rows] = await pool.query(
      `SELECT id, patient_id, temperature, blood_pressure_systolic, blood_pressure_diastolic, pulse_rate, respiratory_rate, blood_sugar, recorded_at
       FROM daily_tracking WHERE patient_id = ? ORDER BY recorded_at DESC`,
      [patientId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

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
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching daily tracking data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

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
    const [result] = await pool.query(
      `INSERT INTO daily_tracking (
        patient_id,
        temperature,
        blood_pressure_systolic,
        blood_pressure_diastolic,
        pulse_rate,
        respiratory_rate,
        blood_sugar,
        recorded_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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
    res.status(201).json({ message: 'Tracking data added successfully', id: result.insertId });
  } catch (err) {
    console.error('Error adding daily tracking data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.post('/', async (req, res) => {
    console.log('Received data:', req.body);
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

  if (!patient_id) {
    return res.status(400).json({ error: "patient_id is required" });
  }

  try {
    await pool.query(
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
        recorded_at,
      ]
    );

    res.status(201).json({ message: "Daily tracking data saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
