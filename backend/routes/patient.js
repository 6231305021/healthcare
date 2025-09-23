// routes/patient.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// -------------------- Multer config --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'patients');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'patient-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error('Only image files are allowed!'), false);
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// -------------------- Helpers --------------------
const convertUndefinedToNull = (value) => (value === undefined || value === '' ? null : value);
const formatImagePath = (file) => (file ? path.join('uploads', 'patients', path.basename(file.path)) : null);

// -------------------- Routes --------------------

// Create patient
router.post('/', upload.single('patientImage'), async (req, res) => {
  // ▼▼▼ แก้ไข: เพิ่ม benefits ▼▼▼
  const {
    name, age, gender, race, nationality, occupation, illness_info,
    province, district, subdistrict, address_detail, latitude, longitude,
    community_health_worker,
    benefits // <-- 1. รับค่า benefits จากฟอร์ม
  } = req.body;
  // ▲▲▲ สิ้นสุดการแก้ไข ▲▲▲

  if (!name || !age || !gender || !race || !nationality || !occupation || !province || !district || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน: กรุณากรอกข้อมูลที่จำเป็นทั้งหมด' });
  }

  try {
    const imagePath = formatImagePath(req.file);
    // ▼▼▼ แก้ไข: เพิ่ม benefits ในคำสั่ง SQL ▼▼▼
    const [result] = await db.query(
      `INSERT INTO patients
        (name, age, gender, race, nationality, occupation, illness_info,
         province, district, subdistrict, address_detail, latitude, longitude, image_path, community_health_worker, benefits, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`, // <-- 2. เพิ่ม benefits ในคอลัมน์และ VALUES
      [
        name, age, gender, race, nationality, occupation,
        convertUndefinedToNull(illness_info),
        province, district, convertUndefinedToNull(subdistrict),
        convertUndefinedToNull(address_detail),
        latitude, longitude,
        imagePath,
        convertUndefinedToNull(community_health_worker),
        convertUndefinedToNull(benefits) // <-- 3. เพิ่มค่า benefits ที่จะใส่ลงฐานข้อมูล
      ]
    );
    // ▲▲▲ สิ้นสุดการแก้ไข ▲▲▲

    res.status(201).json({ message: 'บันทึกข้อมูลผู้ป่วยสำเร็จ', patientId: result.insertId, imagePath });
  } catch (err) {
    console.error('Error inserting patient:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
});

// Get all patients
router.get('/', async (req, res) => {
  try {
    const [patients] = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
    res.json({ patients });
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM patients WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วย' });
    res.json({ patient: rows[0] });
  } catch (err) {
    console.error('Error fetching patient:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย' });
  }
});

// Update patient
router.put('/:id', upload.single('patientImage'), async (req, res) => {
  const { id } = req.params;
  // ▼▼▼ แก้ไข: เพิ่ม benefits ▼▼▼
  const {
    name, age, gender, race, nationality, occupation, illness_info,
    province, district, subdistrict, address_detail, latitude, longitude,
    community_health_worker,
    benefits // <-- 1. รับค่า benefits จากฟอร์ม
  } = req.body;
  // ▲▲▲ สิ้นสุดการแก้ไข ▲▲▲

  if (!name || !age || !gender || !race || !nationality || !occupation || !province || !district || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน: กรุณากรอกข้อมูลที่จำเป็นทั้งหมด' });
  }

  try {
    const [currentPatient] = await db.query('SELECT image_path FROM patients WHERE id = ?', [id]);
    if (currentPatient.length === 0) return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วยที่ต้องการแก้ไข' });

    let imagePath = currentPatient[0].image_path;
    if (req.file) {
      if (imagePath) {
        const oldImagePath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      imagePath = formatImagePath(req.file);
    }

    // ▼▼▼ แก้ไข: เพิ่ม benefits ในคำสั่ง SQL ▼▼▼
    const [result] = await db.query(
      `UPDATE patients SET
        name = ?, age = ?, gender = ?, race = ?, nationality = ?, occupation = ?, illness_info = ?,
        province = ?, district = ?, subdistrict = ?, address_detail = ?,
        latitude = ?, longitude = ?, image_path = ?, community_health_worker = ?, benefits = ?
        WHERE id = ?`, // <-- 2. เพิ่ม benefits = ? ในคำสั่ง UPDATE
      [
        name, age, gender, race, nationality, occupation,
        convertUndefinedToNull(illness_info),
        province, district, convertUndefinedToNull(subdistrict),
        convertUndefinedToNull(address_detail),
        latitude, longitude,
        imagePath,
        convertUndefinedToNull(community_health_worker),
        convertUndefinedToNull(benefits), // <-- 3. เพิ่มค่า benefits ที่จะอัปเดต
        id
      ]
    );
    // ▲▲▲ สิ้นสุดการแก้ไข ▲▲▲

    res.json({ message: 'อัปเดตข้อมูลผู้ป่วยสำเร็จ', imagePath });
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ป่วย' });
  }
});

// Delete patient
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM patients WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบผู้ป่วยที่ต้องการลบ' });
    res.json({ message: 'ลบผู้ป่วยสำเร็จ' });
  } catch (err) {
    console.error('Error deleting patient:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบผู้ป่วย' });
  }
});

module.exports = router;