const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const bcrypt = require('bcryptjs');

exports.createStudent = async (req, res) => {
  const { name, email, password, mobile, department, year, section, image } = req.body;
  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(400).json({ message: 'Student already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ name, email, password: hashedPassword, mobile, department, year, section, image });
    await student.save();
    res.status(201).json({ message: 'Student created', _id: student._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createFaculty = async (req, res) => {
  const { name, email, password, mobile, department } = req.body;
  try {
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) return res.status(400).json({ message: 'Faculty already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = new Faculty({ name, email, password: hashedPassword, mobile, department, role: 'faculty' });
    await faculty.save();
    res.status(201).json({ message: 'Faculty created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Faculty.findById(req.user.id).select('-password');
    if (!admin || admin.role !== 'admin') return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const admin = await Faculty.findById(req.user.id);
    if (!admin || admin.role !== 'admin') return res.status(404).json({ message: 'Admin not found' });
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};