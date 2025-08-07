const mongoose = require('mongoose');
const activityLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  time: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ActivityLog', activityLogSchema);