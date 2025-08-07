const mongoose = require('mongoose');
const timetableSchema = new mongoose.Schema({
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, required: true }, // e.g., 'Monday'
  slots: [{ time: String, subject: String, class: String }]
});
module.exports = mongoose.model('Timetable', timetableSchema);