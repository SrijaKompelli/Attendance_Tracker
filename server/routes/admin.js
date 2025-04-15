const express = require('express');
const { createStudent, getStudents, createFaculty, getFaculty, getAdminProfile, updatePassword } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/students', authMiddleware('admin'), createStudent);
router.get('/students', authMiddleware('admin'), getStudents);
router.post('/faculty', authMiddleware('admin'), createFaculty);
router.get('/faculty', authMiddleware('admin'), getFaculty);
router.get('/profile', authMiddleware('admin'), getAdminProfile);
router.put('/password', authMiddleware('admin'), updatePassword);

module.exports = router;