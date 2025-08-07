const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up storage for profile images
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => req.user.id + '-' + Date.now(),
  },
});
const upload = multer({ storage });

// Auth middleware
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

// Get current user's profile
router.get('/', async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Update current user's profile
router.put('/', async (req, res) => {
  const { name, email, department, rollno, empid, password } = req.body;
  const update = { name, email, department };
  if (rollno) update.rollno = rollno;
  if (empid) update.empid = empid;
  if (password) update.password = await bcrypt.hash(password, 10);
  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
  res.json(user);
});

// Upload profile image
router.post('/image', upload.single('profileImage'), async (req, res) => {
  const imageUrl = req.file.path; // Cloudinary URL
  await User.findByIdAndUpdate(req.user.id, { profileImage: imageUrl });
  res.json({ profileImage: imageUrl });
});

module.exports = router;