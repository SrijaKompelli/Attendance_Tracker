import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/ListStudents.css';

const ListStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    };
    fetchStudents();
  }, []);

  return (
    <div className="list-students-wrapper">
      <Navbar />
      <div className="list-students-content">
        <Sidebar role="admin" />
        <div className="list-students">
          <h1>Student List</h1>
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Department</th>
                <th>Year</th>
                <th>Section</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.mobile}</td>
                  <td>{s.department}</td>
                  <td>{s.year}</td>
                  <td>{s.section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListStudents;