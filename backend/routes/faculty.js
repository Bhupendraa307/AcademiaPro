const express = require('express');
const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Timetable = require('../models/Timetable');
const User = require('../models/User');
const Notice = require('../models/Notice');
const Department = require('../models/Department');
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

// Get students in faculty's department
router.get('/students', authMiddleware, async (req, res) => {
  const faculty = await User.findById(req.user.id);
  const students = await User.find({ role: 'student', department: faculty.department });
  res.json(students);
});

// Mark attendance (create or update)
router.post('/attendance', authMiddleware, async (req, res) => {
  const { studentId, attended } = req.body;
  let attendance = await Attendance.findOne({ student: studentId });
  if (!attendance) {
    attendance = new Attendance({ student: studentId, total: 1, attended: attended ? 1 : 0 });
  } else {
    attendance.total += 1;
    if (attended) attendance.attended += 1;
  }
  await attendance.save();
  res.json(attendance);
});

// Get results for a student
router.get('/results/:studentId', authMiddleware, async (req, res) => {
  const results = await Result.find({ student: req.params.studentId });
  res.json(results);
});

// Add or update a result for a student
router.post('/results', authMiddleware, async (req, res) => {
  const { studentId, semester, cgpa, subjects } = req.body;
  let result = await Result.findOne({ student: studentId, semester });
  if (result) {
    result.cgpa = cgpa;
    result.subjects = subjects;
    await result.save();
  } else {
    result = new Result({ student: studentId, semester, cgpa, subjects });
    await result.save();
  }
  res.json(result);
});

// Delete a result for a student
router.delete('/results/:resultId', authMiddleware, async (req, res) => {
  await Result.findByIdAndDelete(req.params.resultId);
  res.json({ success: true });
});

// Get faculty timetable
router.get('/timetable', authMiddleware, async (req, res) => {
  const timetable = await Timetable.find({ faculty: req.user.id });
  res.json(timetable);
});

// Add a new timetable entry
router.post('/timetable', authMiddleware, async (req, res) => {
  const { day, time, subject, class: className } = req.body;
  let timetable = await Timetable.findOne({ faculty: req.user.id, day });
  const slot = { time, subject, class: className };
  if (timetable) {
    timetable.slots.push(slot);
    await timetable.save();
  } else {
    timetable = new Timetable({ faculty: req.user.id, day, slots: [slot] });
    await timetable.save();
  }
  res.json(timetable);
});

// Get notices for faculty
router.get('/notices', authMiddleware, async (req, res) => {
  const notices = await Notice.find({ forRole: { $in: ['faculty', 'all'] } }).sort({ date: -1 });
  res.json(notices);
});

// Check if faculty is head of any department
router.get('/head-department', authMiddleware, async (req, res) => {
  const dept = await Department.findOne({ head: req.user.id });
  res.json(dept);
});

module.exports = router;