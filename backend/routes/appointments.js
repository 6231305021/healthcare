const express = require('express');
const router = express.Router();
const db = require('../db');

// GET appointments by patient ID - **แก้ไขกลับเป็นแบบธรรมดา**
router.get('/patient/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.json([]);

  try {
    // กลับไปใช้ SELECT แบบธรรมดา ไม่ต้อง JOIN
    const sql = `
      SELECT * FROM appointments
      WHERE patient_id = ?
      ORDER BY appointment_date DESC, appointment_time DESC`;
    const [appointments] = await db.query(sql, [id]);
    res.json(Array.isArray(appointments) ? appointments : []);
  } catch (err) {
    console.error('Error fetching appointments by patient:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงประวัติการนัดหมายของผู้ป่วย' });
  }
});

// POST: Create a new appointment and update patient's benefits
router.post('/', async (req, res) => {
  const { 
    patient_id, hn_number, rights, appointment_date, appointment_time, 
    reason, appointed_by, contact_location, other_details, diagnosis, status 
  } = req.body;
  
  if (!patient_id || !appointment_date) {
    return res.status(400).json({ message: 'Patient ID and appointment date are required' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // ยังคงอัปเดตสิทธิการรักษาล่าสุดในตาราง patients เหมือนเดิม
    if (rights !== undefined && rights !== null) {
      const updatePatientSql = 'UPDATE patients SET Benefits = ? WHERE id = ?';
      await connection.query(updatePatientSql, [rights, patient_id]);
    }

    // บันทึกการนัดหมาย
    const insertAppointmentSql = `
      INSERT INTO appointments
        (patient_id, hn_number, appointment_date, appointment_time, reason, appointed_by, contact_location, other_details, diagnosis, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
    
    const [result] = await connection.query(insertAppointmentSql, [
      patient_id, hn_number, appointment_date, appointment_time || null, 
      reason || null, appointed_by || null, contact_location || null, 
      other_details || null, diagnosis || null, status || 'รอนัด'
    ]);

    await connection.commit();
    res.status(201).json({ message: 'สร้างการนัดหมายสำเร็จ', appointmentId: result.insertId });

  } catch (err) {
    await connection.rollback();
    console.error('Error creating appointment:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างการนัดหมาย' });
  } finally {
    connection.release();
  }
});

// DELETE: Delete an appointment
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM appointments WHERE id = ?', [id]);
    if (!result || result.affectedRows === 0)
      return res.status(404).json({ message: 'ไม่พบการนัดหมายที่ต้องการลบ' });
    res.json({ message: 'ลบการนัดหมายสำเร็จ' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบการนัดหมาย' });
  }
});

module.exports = router;