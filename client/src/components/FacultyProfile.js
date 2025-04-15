import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/Profile.css';

const FacultyProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      if (!token || role !== 'faculty') {
        setError('Not authenticated as faculty. Please log in.');
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/faculty/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        console.error('Faculty profile fetch error:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleResetPassword = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        'http://localhost:5000/api/faculty/password',
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalError('');
      alert(res.data.message);
      setShowModal(false);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to update password');
    }
  };

  if (!user && !error) {
    return (
      <div className="loading animate-spin">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        Loading...
      </div>
    );
  }

  return (
    <div className="profile-wrapper animate-profile">
      {/* <Navbar /> */}
      <div className="profile-content">
        <Sidebar role="faculty" />
        <div className="profile-container">
          <div className="profile-header animate-header">
            <h1 className="profile-title">Faculty Profile</h1>
            <p className="profile-subtitle">Manage your personal information</p>
          </div>
          {error && <p className="error">{error}</p>}
          {user && (
            <div className="profile-card animate-card">
              {user.image ? (
                <img src={user.image} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-placeholder">{user.name[0].toUpperCase()}</div>
              )}
              <h2 className="profile-name">{user.name}</h2>
              <div className="profile-details">
                <p>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <strong>Role</strong> {user.role}
                </p>
                <p>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <strong>Email</strong> {user.email}
                </p>
                <p>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <strong>Mobile</strong> {user.mobile}
                </p>
                <p>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <strong>Department</strong> {user.department}
                </p>
                <button className="reset-btn" onClick={() => setShowModal(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m0 0v2m0-6h2m-4 0h-2" />
                    <path d="M3 3v18h18V3H3zm2 2h14v14H5V5z" />
                  </svg>
                  Reset Password
                </button>
              </div>
            </div>
          )}
          {showModal && (
            <div className="modal-overlay animate-modal">
              <div className="modal-content">
                <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
                <h3>Reset Password</h3>
                {modalError && <p className="modal-error">{modalError}</p>}
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button className="update-btn" onClick={handleResetPassword}>
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;