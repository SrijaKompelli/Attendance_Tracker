const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, enum: ['admin', 'faculty'], required: true },
  image: { type: String },
  tempAttendance: [{
    date: { type: Date, required: true },
    department: { type: String },
    year: { type: Number },
    section: { type: String },
    period: { type: Number },
    day: { type: String },
    students: [{ studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, present: Boolean }],
  }],
});

module.exports = mongoose.model('Faculty', facultySchema);