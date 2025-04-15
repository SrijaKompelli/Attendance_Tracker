import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AttentivenessProvider } from './context/AttentivenessContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import AdminProfile from './components/AdminProfile';
import FacultyProfile from './components/FacultyProfile';
import CreateStudent from './components/CreateStudent';
import CreateFaculty from './components/CreateFaculty';
import ListStudents from './components/ListStudents';
import ListFaculty from './components/ListFaculty';
import AttendanceTable from './components/AttendanceTable';
import ManageAttendance from './components/ManageAttendance';
import ViewStudent from './components/ViewStudent';
import VideoUpload from './components/VideoUpload';
import AttentivenessDashboard from './components/AttentivenessDashboard';

const AppContent = () => {
  return (
    <AttentivenessProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/create-student" element={<CreateStudent />} />
        <Route path="/admin/create-faculty" element={<CreateFaculty />} />
        <Route path="/admin/list-students" element={<ListStudents />} />
        <Route path="/admin/list-faculty" element={<ListFaculty />} />
        {/* Faculty Routes */}
        <Route path="/faculty/*" element={<FacultyDashboard />}>
          <Route path="" element={<div />} />
          <Route path="profile" element={<FacultyProfile />} />
          <Route path="mark-attendance" element={<AttendanceTable />} />
          <Route path="manage-attendance" element={<ManageAttendance />} />
          <Route path="view-student" element={<ViewStudent />} />
          <Route path="upload-video" element={<VideoUpload />} />
          <Route path="attentiveness-results" element={<AttentivenessDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AttentivenessProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;