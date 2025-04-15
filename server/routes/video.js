const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../middleware/upload');

router.post('/upload-video', upload.single('video'), videoController.uploadVideo);

module.exports = router;