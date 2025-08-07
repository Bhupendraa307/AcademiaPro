const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total: { type: Number, default: 100 },
  attended: { type: Number, default: 0 },
});
module.exports = mongoose.model('Attendance', attendanceSchema);