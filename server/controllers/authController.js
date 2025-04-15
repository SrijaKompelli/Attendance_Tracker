const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    let user;
    const emailRegex = new RegExp(`^${email}$`, 'i');
    switch (role) {
      case 'admin':
        user = await Faculty.findOne({ email: emailRegex, role: 'admin' });
        break;
      case 'faculty':
        user = await Faculty.findOne({ email: emailRegex, role: 'faculty' });
        break;
      case 'student':
        user = await Student.findOne({ email: emailRegex });
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};