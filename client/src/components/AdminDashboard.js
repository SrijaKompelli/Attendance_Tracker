import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/AdminDashboard.css';
import { Routes, Route } from 'react-router-dom';
import AdminProfile from './AdminProfile';
import CreateStudent from './CreateStudent';
import CreateFaculty from './CreateFaculty';
import ListStudents from './ListStudents';
import ListFaculty from './ListFaculty';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-wrapper">
      <Navbar />
      <div className="admin-dashboard-content">
        <Sidebar role="admin" />
        <div className="admin-dashboard animate-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1 className="dashboard-title animate-title">Admin Dashboard</h1>
                  <p className="welcome-text animate-text">Welcome to the Admin Dashboard. Manage your institution here.</p>
                </>
              }
            />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/create-student" element={<CreateStudent />} />
            <Route path="/create-faculty" element={<CreateFaculty />} />
            <Route path="/list-students" element={<ListStudents />} />
            <Route path="/list-faculty" element={<ListFaculty />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;