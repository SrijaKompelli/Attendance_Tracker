import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/CreateFaculty.css';

const CreateFaculty = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', mobile: '', department: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/admin/faculty', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ name: '', email: '', password: '', mobile: '', department: '' });
      alert(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating faculty');
    }
  };

  return (
    <div className="create-faculty-wrapper">
      <Navbar />
      <div className="create-faculty-content">
        <Sidebar role="admin" />
        <div className="create-faculty">
          <h1>Create Faculty</h1>
          <div className="faculty-form-container animate-form">
            <h2 className="form-title">Add New Faculty</h2>
            {error && <p className="error">{error}</p>}
            <form className="faculty-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <select name="department" value={formData.department} onChange={handleChange} required>
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                </select>
              </div>
              <button type="submit" className="submit-btn">Add Faculty</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFaculty;