import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/Profile.css';

const AdminProfile = () => {
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
      if (!token || role !== 'admin') {
        setError('Not authenticated as admin. Please log in.');
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        console.error('Admin profile fetch error:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleResetPassword = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        'http://localhost:5000/api/admin/password',
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

  if (!user && !error) return <div className="loading animate-spin">Loading...</div>;

  return (
    <div className="profile-wrapper">
      <Navbar />
      <div className="profile-content">
        <Sidebar role="admin" />
        <div className="profile-container scroll-up"> {/* Changed to scroll-up */}
          <h1 className="profile-title animate-title">Admin Profile</h1>
          {error && <p className="error animate-error">{error}</p>}
          {user && (
            <div className="profile-card animate-card">
              <div className="profile-header">
                {user.image ? (
                  <img src={user.image} alt="Profile" className="profile-image animate-image" />
                ) : (
                  <div className="profile-placeholder animate-image">{user.name[0].toUpperCase()}</div>
                )}
                <h2 className="profile-name animate-name">{user.name}</h2>
              </div>
              <div className="profile-details">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Mobile:</strong> {user.mobile}</p>
                <p><strong>Department:</strong> {user.department}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <button className="reset-btn animate-btn" onClick={() => setShowModal(true)}>
                  Reset Password
                </button>
              </div>
            </div>
          )}
          {showModal && (
            <div className="modal-overlay animate-modal">
              <div className="modal-content animate-form">
                <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>
                <h3>Reset Password</h3>
                {modalError && <p className="modal-error">{modalError}</p>}
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="animate-input"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="animate-input"
                />
                <button className="update-btn animate-btn" onClick={handleResetPassword}>
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

export default AdminProfile;