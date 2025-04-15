const express = require('express');
const {
  markAttendance,
  getStudentsByFilters,
  getMarkedAttendance,
  updateAttendance,
  getFacultyProfile,
  updatePassword,
  updateStudent,
  uploadAttentivityVideo,
  analyzeAttentivity,
} = require('../controllers/facultyController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/attendance', authMiddleware('faculty'), markAttendance);
router.get('/students', authMiddleware('faculty'), getStudentsByFilters);
router.get('/attendance', authMiddleware('faculty'), getMarkedAttendance);
router.put('/attendance/:attendanceId', authMiddleware('faculty'), updateAttendance);
router.get('/profile', authMiddleware('faculty'), getFacultyProfile);
router.put('/password', authMiddleware('faculty'), updatePassword);
router.put('/students/:id', authMiddleware('faculty'), updateStudent);
router.post('/upload-attentivity-video', authMiddleware('faculty'), upload.single('video'), uploadAttentivityVideo);
router.post('/analyze-attentivity', authMiddleware('faculty'), analyzeAttentivity);

module.exports = router;