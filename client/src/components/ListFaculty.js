import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/ListFaculty.css';

const ListFaculty = () => {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    const fetchFaculty = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/faculty', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaculty(res.data);
    };
    fetchFaculty();
  }, []);

  return (
    <div className="list-faculty-wrapper">
      <Navbar />
      <div className="list-faculty-content">
        <Sidebar role="admin" />
        <div className="list-faculty">
          <h1>Faculty List</h1>
          <table className="faculty-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Department</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((f) => (
                <tr key={f._id}>
                  <td>{f.name}</td>
                  <td>{f.email}</td>
                  <td>{f.mobile}</td>
                  <td>{f.department}</td>
                  <td>{f.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListFaculty;