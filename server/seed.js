const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Faculty = require('./models/Faculty');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const facultyPassword = await bcrypt.hash('faculty123', salt);

    await Faculty.deleteMany({});
    await Faculty.insertMany([
      {
        name: 'Admin',
        email: 'admin@college.com',
        password: adminPassword,
        mobile: '9876543210',
        role: 'admin',
        department: 'ALL',
        image: 'admin.png',
      },
      {
        name: 'Faculty',
        email: 'faculty@college.com',
        password: facultyPassword,
        mobile: '9876543211',
        role: 'faculty',
        department: 'CSE',
        image: 'faculty.png',
      },
    ]);
    console.log('Default accounts seeded');
    mongoose.connection.close();
  })
  .catch(err => console.log(err));