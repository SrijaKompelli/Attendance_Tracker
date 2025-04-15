import React, { useState } from 'react';
import axios from 'axios';
import '../styles/StudentDetailsModal.css';

const StudentDetailsModal = ({ student, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState({ ...student });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/faculty/students/${student._id}`,
        editedStudent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError('');
      alert(res.data.message);
      setIsEditing(false);
      student = res.data.student; // Update local student data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student.');
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <div className="student-details">
          <div className="student-image">
            <img src={`/assets/${student.image || 'default-student.png'}`} alt="Student" />
          </div>
          <div className="student-info">
            {isEditing ? (
              <>
                <input name="name" value={editedStudent.name} onChange={handleChange} />
                <input name="email" value={editedStudent.email} onChange={handleChange} />
                <input name="mobile" value={editedStudent.mobile} onChange={handleChange} />
                <input name="department" value={editedStudent.department} onChange={handleChange} />
                <input name="year" value={editedStudent.year} onChange={handleChange} />
                <input name="section" value={editedStudent.section} onChange={handleChange} />
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>Save</button>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h2>{student.name}</h2>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Mobile:</strong> {student.mobile}</p>
                <p><strong>Department:</strong> {student.department}</p>
                <p><strong>Year:</strong> {student.year}</p>
                <p><strong>Section:</strong> {student.section}</p>
                <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
              </>
            )}
            {error && <p className="error">{error}</p>}
          </div>
        </div>
        <div className="attendance-table">
          <h3>Attendance</h3>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                {[...Array(7)].map((_, i) => <th key={i}>P{i + 1}</th>)}
              </tr>
            </thead>
            <tbody>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <tr key={day}>
                  <td>{day}</td>
                  {student.attendance[day].map((status, i) => (
                    <td key={i}>{status === 1 ? '✅' : '❌'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;