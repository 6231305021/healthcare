const express = require('express');
const router = express.Router();
const db = require('../db'); 


// GET all appointments for a specific patient
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT id, name FROM patients WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error fetching patient details', error: error.message });
  }
});

router.get('/patient/:patientId', async (req, res) => {
  const { patientId } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM appointments WHERE patient_id = ? ORDER BY appointment_date DESC, appointment_time DESC', [patientId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error fetching appointments', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    hn_number,
    rights,
    appointment_date,
    appointment_time,
    reason,
    appointed_by,
    contact_location,
    other_details,
    diagnosis,
    status
  } = req.body;

  // Basic validation
  if (!hn_number || !rights || !appointment_date || !appointment_time || !status) {
    return res.status(400).json({ message: 'Missing required appointment fields.' });
  }

  try {
    const [result] = await db.execute(
      `UPDATE appointments SET
        hn_number = ?, rights = ?, appointment_date = ?, appointment_time = ?, reason = ?, appointed_by = ?, contact_location = ?, other_details = ?, diagnosis = ?, status = ?
      WHERE id = ?`,
      [hn_number, rights, appointment_date, appointment_time, reason, appointed_by, contact_location, other_details, diagnosis, status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error updating appointment', error: error.message });
  }
});

// POST a new appointment
// Endpoint: POST /api/appointments
router.post('/', async (req, res) => {
  const {
    patient_id,
    hn_number,
    rights,
    appointment_date,
    appointment_time,
    reason,
    appointed_by,
    contact_location,
    other_details,
    diagnosis,
    status
  } = req.body;

  // Basic validation (can be enhanced)
  if (!patient_id || !hn_number || !rights || !appointment_date || !appointment_time || !status) {
    return res.status(400).json({ message: 'Missing required appointment fields.' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO appointments (patient_id, hn_number, rights, appointment_date, appointment_time, reason, appointed_by, contact_location, other_details, diagnosis, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [patient_id, hn_number, rights, appointment_date, appointment_time, reason, appointed_by, contact_location, other_details, diagnosis, status]
    );
    res.status(201).json({ message: 'Appointment added successfully', appointmentId: result.insertId });
  } catch (error) {
    console.error('Error adding appointment:', error);
    res.status(500).json({ message: 'Server error adding appointment', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM appointments WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error deleting appointment', error: error.message });
  }
});

module.exports = router;