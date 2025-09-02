require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const geocodeRouter = require('./routes/geocode');
const userRoutes = require('./routes/user.js');
const patientsRouter = require('./routes/patient.js');
const dailyTrackingRoutes = require('./routes/dailyTracking');
const appointmentRoutes = require('./routes/appointments');

const app = express();

// ✅ Ensure uploads dir
const uploadsDir = path.join(__dirname, 'uploads', 'patients');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Security middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// ✅ CORS config
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// ✅ Body parser
app.use(express.json({ limit: '10mb' }));

// ✅ Static for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api', geocodeRouter);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientsRouter);
app.use('/api/daily-tracking', dailyTrackingRoutes);
app.use('/api/appointments', appointmentRoutes);

// ✅ Serve frontend build (dist)
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Catch-all: ส่ง index.html กลับถ้าไม่ใช่ API
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
