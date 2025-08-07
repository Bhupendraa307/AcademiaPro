const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null for global/role-based
  role: { type: String, enum: ['student', 'faculty', 'admin'] }, // optional, for role-based
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String }, // optional, e.g., /results/123
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);