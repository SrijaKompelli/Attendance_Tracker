import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AttendanceTable.css';

const AttendanceTable = ({ filters }) => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      // Only fetch when all required filters are provided
      if (filters.department && filters.year && filters.section) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('No authentication token found. Please log in again.');
            return;
          }

          console.log('Fetching students with filters:', filters);
          const res = await axios.get('http://localhost:5000/api/faculty/students', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              department: filters.department,
              year: filters.year,
              section: filters.section,
            },
          });

          console.log('Fetched students:', res.data);
          setStudents(res.data);
          setError(res.data.length === 0 ? 'No students found for these filters.' : '');
        } catch (err) {
          console.error('Fetch error:', err.response?.data || err.message);
          setError(err.response?.data?.message || 'Failed to fetch students. Check server logs.');
          setStudents([]);
        }
      } else {
        setStudents([]);
        setError('Please select department, year, and section to fetch students.');
      }
    };
    fetchStudents();
  }, [filters]); // Include the entire filters object as a dependency

  const markAllPresent = () => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student._id] = true;
    });
    setAttendance(newAttendance);
  };

  const markAllAbsent = () => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student._id] = false;
    });
    setAttendance(newAttendance);
  };

  const handleAttendanceChange = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const saveAttendance = async () => {
    if (!filters.date || !filters.period || !filters.day) {
      setError('Please select date, period, and day to save attendance.');
      return;
    }

    if (students.length === 0) {
      setError('No students available to mark attendance.');
      return;
    }

    if (Object.keys(attendance).length === 0) {
      setError('Please mark attendance for at least one student.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const attendanceData = {
        date: filters.date,
        department: filters.department,
        year: filters.year,
        section: filters.section,
        period: parseInt(filters.period),
        day: filters.day,
        students: Object.keys(attendance).map(studentId => ({
          studentId,
          present: attendance[studentId],
        })),
      };

      console.log('Saving attendance with data:', attendanceData);
      const res = await axios.post('http://localhost:5000/api/faculty/attendance', attendanceData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setError('');
      alert(res.data.message);
      setAttendance({}); // Clear attendance after saving
    } catch (err) {
      console.error('Save attendance error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to save attendance.');
    }
  };

  return (
    <div className="attendance-table">
      <div className="actions">
        <button onClick={markAllPresent} className="btn present-btn" disabled={students.length === 0}>
          Mark All Present
        </button>
        <button onClick={markAllAbsent} className="btn absent-btn" disabled={students.length === 0}>
          Mark All Absent
        </button>
        <button onClick={saveAttendance} className="btn save-btn" disabled={students.length === 0}>
          Save Attendance
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {students.length === 0 ? (
        <p>Select all filters to display students.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Attendance</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={attendance[student._id] || false}
                    onChange={() => handleAttendanceChange(student._id)}
                  />
                </td>
                <td>
                  <button onClick={() => navigate(`/attendance-view/${student._id}`)} className="view-btn">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceTable;