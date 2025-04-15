import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AttendanceTable from './AttendanceTable';
import ManageAttendance from './ManageAttendance';
import FacultyProfile from './FacultyProfile';
import ViewStudent from './ViewStudent';
import VideoUpload from './VideoUpload';
import AttentivenessDashboard from './AttentivenessDashboard';
import { AttentivenessProvider } from '../context/AttentivenessContext';
import '../styles/FacultyDashboard.css';

const FacultyDashboard = () => {
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    section: '',
    date: '',
    period: '',
    day: '',
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="faculty-dashboard">
      <Navbar />
      <div className="faculty-dashboard-content">
        <Sidebar role="faculty" />
        <div className="content animate-content">
          <AttentivenessProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <h1 className="dashboard-title animate-title">Faculty Dashboard</h1>
                    <p className="welcome-text animate-text">Welcome to your dashboard. Explore options in the sidebar.</p>
                  </>
                }
              />
              <Route
                path="/mark-attendance"
                element={
                  <>
                    <h1 className="dashboard-title animate-title">Mark Attendance</h1>
                    <div className="filters animate-filters">
                    <select name="department" onChange={handleFilterChange} value={filters.department} className="animate-input">
                      <option value="">Select Department</option>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                    </select>
                      <select name="year" onChange={handleFilterChange} value={filters.year} className="animate-input">
                        <option value="">Select Year</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                      <select name="section" onChange={handleFilterChange} value={filters.section} className="animate-input">
                      <option value="">Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                    </select>
                      <input type="date" name="date" onChange={handleFilterChange} value={filters.date} className="animate-input" />
                      <select name="period" onChange={handleFilterChange} value={filters.period} className="animate-input">
                        <option value="">Select Period</option>
                        {[...Array(7)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <select name="day" onChange={handleFilterChange} value={filters.day} className="animate-input">
                        <option value="">Select Day</option>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <AttendanceTable filters={filters} />
                  </>
                }
              />
              <Route path="/manage-attendance" element={<ManageAttendance />} />
              <Route path="/profile" element={<FacultyProfile />} />
              <Route path="/view-student" element={<ViewStudent />} />
              <Route path="/upload-video" element={<VideoUpload />} />
              <Route path="/attentiveness-results" element={<AttentivenessDashboard />} />
            </Routes>
          </AttentivenessProvider>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;