import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ManageAttendance.css';

const ManageAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/faculty/attendance', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendanceRecords(res.data);
      } catch (err) {
        setError('Failed to fetch attendance records.');
        console.error(err);
      }
    };
    fetchAttendance();
  }, []);

  const handleEdit = (record) => {
    setEditingRecord({ ...record });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/faculty/attendance/${editingRecord._id}`,
        editingRecord,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendanceRecords(prev =>
        prev.map(record => (record._id === editingRecord._id ? editingRecord : record))
      );
      setEditingRecord(null);
      alert(res.data.message);
    } catch (err) {
      setError('Failed to update attendance.');
      console.error(err);
    }
  };

  const handleAttendanceChange = (studentId) => {
    setEditingRecord(prev => ({
      ...prev,
      students: prev.students.map(student =>
        student.studentId._id === studentId
          ? { ...student, present: !student.present }
          : student
      ),
    }));
  };

  return (
    <div className="manage-attendance">
      <h1 className="title">Manage Attendance</h1>
      {error && <p className="error">{error}</p>}
      {attendanceRecords.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <div className="records">
          {attendanceRecords.map(record => (
            <div key={record._id} className="record-card">
              <div className="record-info">
                <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                <p><strong>Department:</strong> {record.department}</p>
                <p><strong>Year:</strong> {record.year}</p>
                <p><strong>Section:</strong> {record.section}</p>
                <p><strong>Period:</strong> {record.period}</p>
                <p><strong>Day:</strong> {record.day}</p>
              </div>
              {editingRecord && editingRecord._id === record._id ? (
                <div className="edit-section">
                  <h3>Edit Attendance</h3>
                  <table className="edit-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Present</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editingRecord.students.map(student => (
                        <tr key={student.studentId._id}>
                          <td>{student.studentId.name}</td>
                          <td>{student.studentId.email}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={student.present}
                              onChange={() => handleAttendanceChange(student.studentId._id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="edit-actions">
                    <button onClick={handleUpdate} className="save-btn">Save Changes</button>
                    <button onClick={() => setEditingRecord(null)} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => handleEdit(record)} className="edit-btn">Edit</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAttendance;