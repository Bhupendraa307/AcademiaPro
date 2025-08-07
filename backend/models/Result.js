// console.log('Loading Result model');
const mongoose = require('mongoose');
const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: String, required: true },
  cgpa: { type: Number, required: true },
  subjects: [{
    name: String,
    grade: String,
    marks: Number,
  }],
});
module.exports = mongoose.model('Result', resultSchema);