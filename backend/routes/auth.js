const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "healthcare2025webproject";

module.exports = (db) => {
  const router = express.Router();

  // -------------------- Register --------------------
  router.post("/register", async (req, res) => {
    const {
      citizenId,
      firstName,
      lastName,
      phone,
      email,
      location,
      password,
      latitude,
      longitude,
    } = req.body;

    if (
      !citizenId ||
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !location ||
      !password ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    }

    try {
      const [existingUser] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "อีเมลถูกใช้งานแล้ว" });
      }

      const [existingIdCard] = await db.query(
        "SELECT id FROM users WHERE citizen_id = ?",
        [citizenId]
      );
      if (existingIdCard.length > 0) {
        return res
          .status(400)
          .json({ message: "เลขบัตรประชาชนนี้ถูกใช้งานแล้ว" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const role = "user";

      await db.query(
        `INSERT INTO users (citizen_id, first_name, last_name, phone, email, address, password, latitude, longitude, role)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          citizenId,
          firstName,
          lastName,
          phone,
          email,
          location,
          hashedPassword,
          latitude,
          longitude,
          role,
        ]
      );

      res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
  });

  // -------------------- Login --------------------
  router.post("/login", async (req, res) => {
    const { citizenId, password } = req.body;
    if (!citizenId || !password) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    }

    try {
      const [rows] = await db.query("SELECT * FROM users WHERE citizen_id = ?", [
        citizenId,
      ]);
      if (rows.length === 0) {
        return res
          .status(401)
          .json({ message: "เลขบัตรประชาชนหรือรหัสผ่านไม่ถูกต้อง" });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "เลขบัตรประชาชนหรือรหัสผ่านไม่ถูกต้อง" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          citizenId: user.citizen_id,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          citizenId: user.citizen_id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "เกิดข้อผิดพลาด" });
    }
  });

  return router;
};
