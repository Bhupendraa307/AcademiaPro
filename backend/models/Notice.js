const mongoose = require('mongoose');
const noticeSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  forRole: { type: String, enum: ['student', 'faculty', 'admin', 'all'], default: 'all' }
});
module.exports = mongoose.model('Notice', noticeSchema);