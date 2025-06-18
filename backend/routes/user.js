const db = require('../db.js');
const express = require('express');
const router = express.Router();




router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.execute('SELECT id, first_name, last_name, citizen_id, address, latitude, longitude, phone, email FROM users WHERE id = ?', [userId]);
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งาน' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
});


router.put('/:id', async (req, res) => { 
  const userId = req.params.id;
  const { first_name, last_name, address, phone, email } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE users SET first_name = ?, last_name = ?, address = ?, phone = ?, email = ? WHERE id = ?',
      [first_name, last_name, address, phone, email, userId]
    );

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'อัปเดตข้อมูลโปรไฟล์สำเร็จ!' });
    } else {
      res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งาน หรือไม่มีการเปลี่ยนแปลงข้อมูล' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
});


router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let query = `
      SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        address,
        latitude,
        longitude,
        citizen_id
      FROM users
    `;

    const params = [];

    if (search) {
      query += `
        WHERE 
          first_name LIKE ? OR 
          last_name LIKE ? OR 
          email LIKE ? OR 
          address LIKE ? OR
          citizen_id LIKE ?
      `;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [users] = await db.query(query, params);
    
    // เพิ่ม log เพื่อตรวจสอบข้อมูล
    // console.log('Users data from database:', users.map(user => ({
    //   name: `${user.first_name} ${user.last_name}`,
    //   coordinates: {
    //     latitude: user.latitude,
    //     longitude: user.longitude
    //   }
    // })));

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

// Update user coordinates
router.put('/:id/coordinates', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.params.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'กรุณาระบุพิกัด' });
    }

    // ตรวจสอบว่าพิกัดอยู่ในช่วงที่ถูกต้อง
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lon) || 
        lat < -90 || lat > 90 || 
        lon < -180 || lon > 180) {
      return res.status(400).json({ message: 'พิกัดไม่ถูกต้อง' });
    }

    await db.query(
      'UPDATE users SET latitude = ?, longitude = ? WHERE id = ?',
      [lat, lon, userId]
    );

    res.json({ message: 'อัพเดทพิกัดสำเร็จ' });
  } catch (err) {
    console.error('Error updating coordinates:', err);
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดที่ server',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        address,
        latitude,
        longitude
      FROM users 
      WHERE id = ?`,
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    res.json(users[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดที่ server',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
