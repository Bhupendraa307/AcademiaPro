const express = require('express');
const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Notice = require('../models/Notice');
const Fee = require('../models/Fee');
const router = express.Router();

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get Attendance
router.get('/attendance', authMiddleware, async (req, res) => {
  const attendance = await Attendance.findOne({ student: req.user.id });
  if (!attendance) return res.json({ attended: 0, total: 0, percentage: 0 });
  const percentage = attendance.total ? Math.round((attendance.attended / attendance.total) * 100) : 0;
  res.json({ attended: attendance.attended, total: attendance.total, percentage });
});

// Get Results
router.get('/results', authMiddleware, async (req, res) => {
  const results = await Result.find({ student: req.user.id });
  res.json(results);
});

// Get Notices
router.get('/notices', authMiddleware, async (req, res) => {
  const notices = await Notice.find({ $or: [{ forRole: 'student' }, { forRole: 'all' }] }).sort({ date: -1 }).limit(10);
  res.json(notices);
});

// Get Fees
router.get('/fees', authMiddleware, async (req, res) => {
  const fee = await Fee.findOne({ student: req.user.id });
  res.json(fee || { status: 'Unpaid', amount: 0 });
});

module.exports = router;