const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'patients');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'patient-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to convert undefined to null
// This makes the code cleaner for multiple fields
const convertUndefinedToNull = (value) => (value === undefined ? null : value);

// Helper function to format image path
const formatImagePath = (file) => {
  if (!file) return null;
  return path.join('uploads', 'patients', path.basename(file.path));
};

// POST /api/patients
router.post('/', upload.single('patientImage'), async (req, res) => {
    const {
        name, age, gender, race, nationality, occupation, illness_info,
        province, district, subdistrict, address_detail, latitude, longitude,
        community_health_worker
    } = req.body;

    // Validate required fields
    if (!name || !age || !gender || !race || !nationality || !occupation || !province || !district || !latitude || !longitude) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน: กรุณากรอกข้อมูลที่จำเป็นทั้งหมด' });
    }

    try {
        const imagePath = formatImagePath(req.file);
        const [result] = await db.execute(
            `INSERT INTO patients
                (name, age, gender, race, nationality, occupation, illness_info,
                province, district, subdistrict, address_detail,
                latitude, longitude, image_path, community_health_worker, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
                name,
                age,
                gender,
                race,
                nationality,
                occupation,
                convertUndefinedToNull(illness_info),
                province,
                district,
                convertUndefinedToNull(subdistrict),
                convertUndefinedToNull(address_detail),
                latitude,
                longitude,
                imagePath,
                convertUndefinedToNull(community_health_worker)
            ]
        );

        res.status(201).json({ 
            message: 'บันทึกข้อมูลผู้ป่วยสำเร็จ', 
            patientId: result.insertId,
            imagePath: imagePath
        });
    } catch (err) {
        console.error('Error inserting patient:', err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
});

router.get('/', async (req, res) => {
    try {
        const [patients] = await db.execute('SELECT * FROM patients ORDER BY created_at DESC');
        res.json({ patients });
    } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
});

// GET /api/patients/:id — ดึงข้อมูลผู้ป่วยตาม id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM patients WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วย' });
        }
        res.json({ patient: rows[0] });
    } catch (err) {
        console.error('Error fetching patient:', err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย' });
    }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT CONCAT(first_name, " ", last_name) AS name FROM patients WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบผู้ป่วย' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// PUT /api/patients/:id — อัปเดตข้อมูลผู้ป่วย
router.put('/:id', upload.single('patientImage'), async (req, res) => {
    const { id } = req.params;
    const {
        name, age, gender, race, nationality, occupation, illness_info,
        province, district, subdistrict, address_detail, latitude, longitude,
        community_health_worker
    } = req.body;

    // Validate required fields (same as POST)
    if (!name || !age || !gender || !race || !nationality || !occupation || !province || !district || !latitude || !longitude) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน: กรุณากรอกข้อมูลที่จำเป็นทั้งหมด' });
    }

    try {
        // Get current patient data to check if there's an existing image
        const [currentPatient] = await db.execute('SELECT image_path FROM patients WHERE id = ?', [id]);
        
        let imagePath = currentPatient[0]?.image_path;

        // If new image is uploaded, update the image path
        if (req.file) {
            // Delete old image if exists
            if (currentPatient[0]?.image_path) {
                const oldImagePath = path.join(__dirname, '..', currentPatient[0].image_path);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            imagePath = formatImagePath(req.file);
        }

        const [result] = await db.execute(
            `UPDATE patients SET
                name = ?, age = ?, gender = ?, race = ?, nationality = ?, occupation = ?, illness_info = ?,
                province = ?, district = ?, subdistrict = ?, address_detail = ?,
                latitude = ?, longitude = ?, image_path = ?, community_health_worker = ?
            WHERE id = ?`,
            [
                name,
                age,
                gender,
                race,
                nationality,
                occupation,
                convertUndefinedToNull(illness_info),
                province,
                district,
                convertUndefinedToNull(subdistrict),
                convertUndefinedToNull(address_detail),
                latitude,
                longitude,
                imagePath,
                convertUndefinedToNull(community_health_worker),
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วยที่ต้องการแก้ไข' });
        }

        res.json({ 
            message: 'อัปเดตข้อมูลผู้ป่วยสำเร็จ',
            imagePath: imagePath
        });
    } catch (err) {
        console.error('Error updating patient:', err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ป่วย' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM patients WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'ไม่พบผู้ป่วยที่ต้องการลบ' });
        }
        res.json({ msg: 'ลบผู้ป่วยสำเร็จ' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;