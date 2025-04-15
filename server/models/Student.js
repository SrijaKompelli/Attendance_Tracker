const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  section: { type: String, required: true },
  image: { type: String },
  attendance: {
    Monday: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    Tuesday: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    Wednesday: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    Thursday: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    Friday: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    Saturday: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
  },
  attentivityRecords: [
    {
      videoUrl: { type: String, required: true },
      analysisResult: { type: Object },
      snapshotUrl: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Student', studentSchema);