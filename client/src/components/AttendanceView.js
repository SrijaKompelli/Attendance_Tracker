import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/AttendanceView.css';

const AttendanceView = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const res = await axios.get(`http://localhost:5000/api/admin/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const foundStudent = res.data.find(s => s._id === studentId);
        if (!foundStudent) {
          throw new Error('Student not found');
        }
        setStudent(foundStudent);
      } catch (error) {
        console.error('Error fetching student:', error);
        // Optionally set an error state to display to the user
      }
    };

    fetchStudent();
  }, [studentId]);

  const calculateAttendance = () => {
    if (!student || !student.attendance) {
      return { overall: 0, periodWise: Array(7).fill(0) };
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let totalClasses = 0;
    let presentClasses = 0;
    const periodWise = Array(7).fill(0).map(() => ({ total: 0, present: 0 }));

    days.forEach(day => {
      if (student.attendance[day] && Array.isArray(student.attendance[day])) {
        student.attendance[day].forEach((status, index) => {
          if (index < 7) { // Ensure we don't exceed 7 periods
            totalClasses++;
            if (status === 1) presentClasses++;
            periodWise[index].total++;
            if (status === 1) periodWise[index].present++;
          }
        });
      }
    });

    return {
      overall: totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0,
      periodWise: periodWise.map(p => p.total > 0 ? (p.present / p.total) * 100 : 0),
    };
  };

  if (!student) return <div>Loading...</div>;

  const { overall, periodWise } = calculateAttendance();

  return (
    <div className="attendance-view">
      <h1>Attendance for {student.name}</h1>
      <p>Email: {student.email}</p>
      <p>Department: {student.department} | Year: {student.year} | Section: {student.section}</p>
      <h2>Overall Attendance: {overall.toFixed(2)}%</h2>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            {[...Array(7)].map((_, i) => (
              <th key={i}>Period {i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
            <tr key={day}>
              <td>{day}</td>
              {(student.attendance[day] || Array(7).fill(0)).slice(0, 7).map((status, i) => (
                <td key={i}>{status === 1 ? 'Present' : 'Absent'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Period-wise Attendance</h2>
      <table>
        <thead>
          <tr>
            {[...Array(7)].map((_, i) => (
              <th key={i}>Period {i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {periodWise.map((percentage, i) => (
              <td key={i}>{percentage.toFixed(2)}%</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceView;