const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const facultyRoutes = require('./routes/faculty');
const videoRoutes = require('./routes/video');
const snapshotRoutes = require('./routes/snapshots');
const path = require('path');

dotenv.config();

// Set environment variables directly if not available from .env
process.env.JWT_SECRET = process.env.JWT_SECRET || 'presentrack_jwt_secret_key_123';
process.env.PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// Serve snapshots with logging
app.use('/snapshots', (req, res, next) => {
    console.log(`Snapshot request: ${req.originalUrl}`);
    next();
}, snapshotRoutes);

// Video upload route
app.use('/api', videoRoutes);

// Existing routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);

// MongoDB connection with hardcoded URI for testing
const MONGO_URI = 'mongodb://127.0.0.1:27017/presentrack';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));