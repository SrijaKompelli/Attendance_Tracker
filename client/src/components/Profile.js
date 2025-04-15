import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || !role) {
          setError('Not authenticated. Please log in.');
          return;
        }

        const endpoint = role === 'admin' ? '/api/admin/profile' : '/api/faculty/profile';
        const res = await axios.get(`http://localhost:5000${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile. Please check your credentials.');
        console.error('Profile fetch error:', err.response || err);
      }
    };
    fetchProfile();
  }, []);

  const handleResetPassword = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      if (!role) throw new Error('Role not found');
      const endpoint = role === 'admin' ? '/api/admin/password' : '/api/faculty/password';
      const res = await axios.put(
        `http://localhost:5000${endpoint}`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalError('');
      alert(res.data.message);
      setShowModal(false);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to update password.');
      console.error('Password reset error:', err.response || err);
    }
  };

  if (!user && !error) return <div className="loading animate-spin">Loading...</div>;

  return (
    <div className="profile-wrapper">
      {/* <Navbar /> */}
      <div className="profile-content">
        <Sidebar role={user?.role || localStorage.getItem('role') || 'admin'} />
        <div className="profile-container animate-profile">
          <h1 className="profile-title animate-title">
            {user?.role === 'admin' ? 'Admin Profile' : 'Faculty Profile'}
          </h1>
          {error && <p className="error animate-error">{error}</p>}
          {user && (
            <div className="profile-card animate-card">
              <div className="profile-header">
                {user.image ? (
                  <div className="profile-image animate-image">
                    <img src={user.image} alt={`${user.role} Profile`} />
                  </div>
                ) : (
                  <div className="profile-placeholder animate-image">
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <h2 className="profile-name animate-name">{user.name}</h2>
              </div>
              <div className="profile-details">
                <div className="detail-item animate-detail">
                  <span className="label">Email:</span>
                  <span className="value">{user.email}</span>
                </div>
                <div className="detail-item animate-detail">
                  <span className="label">Mobile:</span>
                  <span className="value">{user.mobile}</span>
                </div>
                <div className="detail-item animate-detail">
                  <span className="label">Department:</span>
                  <span className="value">{user.department}</span>
                </div>
                <div className="detail-item animate-detail">
                  <span className="label">Role:</span>
                  <span className="value">{user.role}</span>
                </div>
                <button className="reset-btn animate-btn" onClick={() => setShowModal(true)}>
                  Reset Password
                </button>
              </div>
            </div>
          )}

          {showModal && (
            <div className="modal-overlay animate-modal">
              <div className="modal-content animate-form">
                <button className="close-btn animate-btn" onClick={() => setShowModal(false)}>✖</button>
                <h3>Reset Password</h3>
                {modalError && <p className="modal-error animate-error">{modalError}</p>}
                <div className="form-group">
                  <label>Old Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="animate-input"
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="animate-input"
                  />
                </div>
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

export default Profile;