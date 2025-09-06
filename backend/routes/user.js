// routes/user.js
const express = require('express');
const router = express.Router();
const db = require('../db.js');

// -------------------- Get single user --------------------
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [users] = await db.query(
      `SELECT 
        id, 
        first_name, 
        last_name, 
        citizen_id, 
        email, 
        phone,
        address,
        latitude,
        longitude,
        role
      FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งาน' });
    }

    res.json({ success: true, user: users[0] });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
});

// -------------------- Update user profile --------------------
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { first_name, last_name, address, phone, email } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE users SET first_name = ?, last_name = ?, address = ?, phone = ?, email = ? WHERE id = ?',
      [first_name, last_name, address, phone, email, userId]
    );

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'อัปเดตข้อมูลโปรไฟล์สำเร็จ!' });
    } else {
      res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งาน หรือไม่มีการเปลี่ยนแปลงข้อมูล' });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
});

// -------------------- Get all users with pagination & search --------------------
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let query = `SELECT id, first_name, last_name, email, address, latitude, longitude, citizen_id FROM users`;
    const params = [];

    if (search) {
      query += ` WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR address LIKE ? OR citizen_id LIKE ?`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [users] = await db.query(query, params);
    const [total] = await db.query('SELECT COUNT(*) as total FROM users');

    res.json({
      users,
      pagination: {
        total: total[0].total,
        page,
        limit,
        totalPages: Math.ceil(total[0].total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดที่ server',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// -------------------- Update user coordinates --------------------
router.put('/:id/coordinates', async (req, res) => {
  const userId = req.params.id;
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: 'กรุณาระบุพิกัด' });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res.status(400).json({ message: 'พิกัดไม่ถูกต้อง' });
  }

  try {
    await db.query('UPDATE users SET latitude = ?, longitude = ? WHERE id = ?', [lat, lon, userId]);
    res.json({ message: 'อัพเดทพิกัดสำเร็จ' });
  } catch (err) {
    console.error('Error updating coordinates:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ server' });
  }
});

module.exports = router;
