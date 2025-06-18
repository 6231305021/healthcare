const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/geocode', async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ message: 'กรุณาระบุที่อยู่' });
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1,
        limit: 1,
      },
      headers: {
        'User-Agent': 'disaster-ai-app/1.0',
      },
    });

    if (response.data.length === 0) {
      return res.status(404).json({ message: 'ไม่พบพิกัดสำหรับที่อยู่นี้' });
    }

    const result = response.data[0];

    res.json({
      lat: result.lat,
      lon: result.lon,
      display_name: result.display_name,
      raw: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะแปลงพิกัด' });
  }
});

module.exports = router;
