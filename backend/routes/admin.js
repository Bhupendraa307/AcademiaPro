const express = require('express');
const Department = require('../models/Department');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const ActivityLog = require('../models/ActivityLog');
const jwt = require('jsonwebtoken');
const Fee = require('../models/Fee');
const Notice = require('../models/Notice');
const Notification = require('../models/Notification');
const router = express.Router();

// --- Auth Middleware ---
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
router.use(authMiddleware);

// --- Helper to log actions ---
async function logAction(adminId, action) {
  await ActivityLog.create({ admin: adminId, action });
}

// --- Departments CRUD ---
router.get('/departments', async (req, res) => {
  const departments = await Department.find().populate('head', 'name email');
  res.json(departments);
});
router.post('/departments', async (req, res) => {
  const { name, head } = req.body;
  const dept = new Department({ name, head });
  await dept.save();
  await logAction(req.user.id, `Added department: ${name}`);
  res.json(dept);
});
router.put('/departments/:id', async (req, res) => {
  const { name, head } = req.body;
  const dept = await Department.findByIdAndUpdate(req.params.id, { name, head }, { new: true });
  await logAction(req.user.id, `Updated department: ${name}`);
  res.json(dept);
});
router.delete('/departments/:id', async (req, res) => {
  const dept = await Department.findByIdAndDelete(req.params.id);
  await logAction(req.user.id, `Deleted department: ${dept?.name}`);
  res.json({ success: true });
});

// --- Teachers CRUD ---
router.get('/teachers', async (req, res) => {
  const teachers = await User.find({ role: 'faculty' });
  res.json(teachers);
});
router.post('/teachers', async (req, res) => {
  const { name, email, password, empid, department } = req.body;
  // Do NOT hash password here; let the pre-save hook handle it
  const user = new User({ name, email, password, empid, department, role: 'faculty' });
  await user.save();
  await logAction(req.user.id, `Created teacher: ${user.name} (${user.email})`);
  res.json(user);
});
router.put('/teachers/:id', async (req, res) => {
  const { name, email, empid, department } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { name, email, empid, department }, { new: true });
  await logAction(req.user.id, `Updated teacher: ${user?.name} (${user?.email})`);
  res.json(user);
});
router.delete('/teachers/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  await logAction(req.user.id, `Deleted teacher: ${user?.name} (${user?.email})`);
  res.json({ success: true });
});

// --- Students CRUD ---
router.get('/students', async (req, res) => {
  const students = await User.find({ role: 'student' });
  res.json(students);
});
router.post('/students', async (req, res) => {
  const { name, email, password, rollno, department } = req.body;
  // Do NOT hash password here; let the pre-save hook handle it
  const user = new User({ name, email, password, rollno, department, role: 'student' });
  await user.save();
  await logAction(req.user.id, `Created student: ${user.name} (${user.email})`);
  res.json(user);
});
router.put('/students/:id', async (req, res) => {
  const { name, email, rollno, department } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { name, email, rollno, department }, { new: true });
  await logAction(req.user.id, `Updated student: ${user?.name} (${user?.email})`);
  res.json(user);
});
router.delete('/students/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  await logAction(req.user.id, `Deleted student: ${user?.name} (${user?.email})`);
  res.json({ success: true });
});

// --- FEES CRUD ---
// Get all fees (optionally filter by student)
router.get('/fees', async (req, res) => {
  const { student } = req.query;
  const query = student ? { student } : {};
  const fees = await Fee.find(query).populate('student', 'name email rollno');
  res.json(fees);
});
// Create fee
router.post('/fees', async (req, res) => {
  const fee = new Fee(req.body);
  await fee.save();
  // Notify the student
  if (fee.student) {
    const notif = new Notification({
      user: fee.student,
      title: 'New Fee Assigned',
      message: `A new fee has been assigned. Amount: Rs. ${fee.amount || ''}`,
      link: '/fees',
    });
    await notif.save();
  }
  res.json(fee);
});
// Update fee
router.put('/fees/:id', async (req, res) => {
  const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  // Notify the student
  if (fee.student) {
    const notif = new Notification({
      user: fee.student,
      title: 'Fee Updated',
      message: `Your fee details have been updated. Amount: Rs. ${fee.amount || ''}`,
      link: '/fees',
    });
    await notif.save();
  }
  res.json(fee);
});
// Delete fee
router.delete('/fees/:id', async (req, res) => {
  await Fee.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// --- NOTICES CRUD ---
// Get all notices
router.get('/notices', async (req, res) => {
  const notices = await Notice.find().sort({ date: -1 });
  res.json(notices);
});
// Create notice
router.post('/notices', async (req, res) => {
  const notice = new Notice(req.body);
  await notice.save();
  // Notify users based on forRole
  let notif;
  if (notice.forRole === 'all') {
    notif = new Notification({
      title: 'New Notice',
      message: notice.title || 'A new notice has been published.',
      link: '/notices',
    });
  } else {
    notif = new Notification({
      role: notice.forRole,
      title: 'New Notice',
      message: notice.title || 'A new notice has been published.',
      link: '/notices',
    });
  }
  await notif.save();
  res.json(notice);
});
// Update notice
router.put('/notices/:id', async (req, res) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  // Notify users based on forRole
  let notif;
  if (notice.forRole === 'all') {
    notif = new Notification({
      title: 'Notice Updated',
      message: notice.title || 'A notice has been updated.',
      link: '/notices',
    });
  } else {
    notif = new Notification({
      role: notice.forRole,
      title: 'Notice Updated',
      message: notice.title || 'A notice has been updated.',
      link: '/notices',
    });
  }
  await notif.save();
  res.json(notice);
});
// Delete notice
router.delete('/notices/:id', async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// --- Reports ---
router.get('/reports', async (req, res) => {
  const totalDepartments = await Department.countDocuments();
  const totalTeachers = await User.countDocuments({ role: 'faculty' });
  const totalStudents = await User.countDocuments({ role: 'student' });
  res.json({ totalDepartments, totalTeachers, totalStudents });
});

// --- Reset Password ---
router.put('/reset-password/:id', async (req, res) => {
  const { password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.findByIdAndUpdate(req.params.id, { password: hashed });
  await logAction(req.user.id, `Reset password for user: ${user?.name} (${user?.email})`);
  res.json({ success: true });
});

// --- Activity Logs ---
router.get('/logs', async (req, res) => {
  const logs = await ActivityLog.find().populate('admin', 'name email').sort({ time: -1 }).limit(100);
  res.json(logs);
});

module.exports = router;