// backend/routes/appointments.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// -------------------- Get all appointments --------------------
router.get('/', async (req, res) => {
  try {
    const { patient_id } = req.query; // รับ query param patient_id
    let query = `SELECT * FROM appointments`;
    const params = [];

    if (patient_id) {
      query += ` WHERE patient_id = ?`;
      params.push(patient_id);
    }

    query += ` ORDER BY appointment_date DESC, appointment_time DESC`;

    const [appointments] = await db.query(query, params);

    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงประวัติการนัดหมาย' });
  }
});

// -------------------- Get appointment by ID --------------------
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'ไม่พบข้อมูลการนัดหมาย' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching appointment:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการนัดหมาย' });
  }
});

// -------------------- Create appointment --------------------
router.post('/', async (req, res) => {
  const { patient_id, appointment_date, appointment_time, reason, appointed_by, contact_location, other_details, diagnosis, status } = req.body;
  if (!patient_id || !appointment_date) {
    return res.status(400).json({ message: 'Patient ID และวันที่นัดหมายต้องระบุ' });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO appointments
       (patient_id, appointment_date, appointment_time, reason, appointed_by, contact_location, other_details, diagnosis, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [patient_id, appointment_date, appointment_time, reason, appointed_by, contact_location, other_details, diagnosis, status]
    );
    res.status(201).json({ message: 'สร้างการนัดหมายสำเร็จ', appointmentId: result.insertId });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างการนัดหมาย' });
  }
});

// -------------------- Update appointment --------------------
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { appointment_date, appointment_time, reason, appointed_by, contact_location, other_details, diagnosis, status } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE appointments SET
       appointment_date = ?, appointment_time = ?, reason = ?, appointed_by = ?, contact_location = ?, other_details = ?, diagnosis = ?, status = ?
       WHERE id = ?`,
      [appointment_date, appointment_time, reason, appointed_by, contact_location, other_details, diagnosis, status, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบข้อมูลการนัดหมายที่ต้องการแก้ไข' });
    res.json({ message: 'อัปเดตการนัดหมายสำเร็จ' });
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตการนัดหมาย' });
  }
});

// -------------------- Delete appointment --------------------
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM appointments WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบการนัดหมายที่ต้องการลบ' });
    res.json({ message: 'ลบการนัดหมายสำเร็จ' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบการนัดหมาย' });
  }
});

module.exports = router;
