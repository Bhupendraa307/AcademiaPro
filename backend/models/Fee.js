const mongoose = require('mongoose');
const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid', 'Partial'], default: 'Unpaid' },
  dueDate: Date,
  lastPaid: Date
});
module.exports = mongoose.model('Fee', feeSchema);