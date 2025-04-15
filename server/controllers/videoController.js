const axios = require('axios');
const path = require('path');

exports.uploadVideo = async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
  }
  const videoPath = path.join(__dirname, '../../uploads', req.file.filename);
  try {
      const response = await axios.post('http://localhost:5001/analyze', { videoPath });
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};