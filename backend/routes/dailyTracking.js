// routes/dailyTracking.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { broadcastMessage } = require('../services/lineMessaging');

// ค่ามาตรฐาน
const BP_SYSTOLIC_MAX = 140;
const BP_SYSTOLIC_MIN = 90;
const BP_DIASTOLIC_MAX = 90;
const BP_DIASTOLIC_MIN = 60;

const TEMP_MAX = 37.5;
const TEMP_MIN = 36.0;

const BLOOD_SUGAR_MAX = 180; // mg/dL
const BLOOD_SUGAR_MIN = 70;  // mg/dL

// ฟังก์ชันตรวจความดัน
function checkBloodPressure(systolic, diastolic) {
  if (systolic >= BP_SYSTOLIC_MAX || diastolic >= BP_DIASTOLIC_MAX) return "สูง";
  if (systolic < BP_SYSTOLIC_MIN || diastolic < BP_DIASTOLIC_MIN) return "ต่ำ";
  return null;
}

// ฟังก์ชันตรวจอุณหภูมิ
function checkTemperature(temp) {
  if (temp > TEMP_MAX) return "สูง";
  if (temp < TEMP_MIN) return "ต่ำ";
  return null;
}

// ฟังก์ชันตรวจน้ำตาล
function checkBloodSugar(sugar) {
  if (sugar > BLOOD_SUGAR_MAX) return "สูง";
  if (sugar < BLOOD_SUGAR_MIN) return "ต่ำ";
  return null;
}

// POST daily tracking พร้อมตรวจค่าและส่ง LINE Broadcast
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
    // 1. ดึงชื่อผู้ป่วยจากฐานข้อมูล
    const [patientRows] = await db.query('SELECT name FROM patients WHERE id = ?', [patient_id]);
    if (patientRows.length === 0) return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วย' });
    const patient_name = patientRows[0].name;

    // 2. บันทึกลงฐานข้อมูล
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

    // 3. ตรวจค่าและเตรียมข้อความแจ้งเตือน
    const messages = [];

    const bpStatus = checkBloodPressure(blood_pressure_systolic, blood_pressure_diastolic);
    if (bpStatus) messages.push(`ผู้ป่วย: ${patient_name}\nความดัน ${blood_pressure_systolic}/${blood_pressure_diastolic} mmHg = ${bpStatus}กว่าปกติ`);

    const tempStatus = checkTemperature(temperature);
    if (tempStatus) messages.push(`ผู้ป่วย: ${patient_name}\nอุณหภูมิ ${temperature}°C = ${tempStatus}กว่าปกติ`);

    const sugarStatus = checkBloodSugar(blood_sugar);
    if (sugarStatus) messages.push(`ผู้ป่วย: ${patient_name}\nน้ำตาล ${blood_sugar} mg/dL = ${sugarStatus}กว่าปกติ`);

    // 4. ส่ง LINE Broadcast เฉพาะค่าที่เกิน/ต่ำ
    if (messages.length > 0) {
      broadcastMessage(messages.join("\n\n"));
    }

    res.status(201).json({ message: 'Daily tracking data added successfully', id: result.insertId });
  } catch (err) {
    console.error('Error adding daily tracking data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET daily tracking ข้อมูลทั้งหมดตาม patient_id
router.get('/patient/:id', async (req, res) => {
  const patient_id = req.params.id;

  if (!patient_id) return res.status(400).json({ message: 'Patient ID is required' });

  try {
    const [rows] = await db.query(
      'SELECT * FROM daily_tracking WHERE patient_id = ? ORDER BY recorded_at DESC',
      [patient_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching daily tracking data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
