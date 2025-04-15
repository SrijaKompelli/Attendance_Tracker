import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ role }) => {
  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: '🏠' },
    { path: '/admin/profile', label: 'Profile', icon: '👤' },
    { path: '/admin/create-student', label: 'Create Student', icon: '➕' },
    { path: '/admin/create-faculty', label: 'Create Faculty', icon: '➕' },
    { path: '/admin/list-students', label: 'List Students', icon: '📋' },
    { path: '/admin/list-faculty', label: 'List Faculty', icon: '📋' },
  ];

  const facultyLinks = [
    { path: '/faculty', label: 'Dashboard', icon: '🏠' },
    { path: '/faculty/profile', label: 'Profile', icon: '👤' },
    { path: '/faculty/mark-attendance', label: 'Mark Attendance', icon: '✔️' },
    { path: '/faculty/manage-attendance', label: 'Manage Attendance', icon: '✏️' },
    { path: '/faculty/view-student', label: 'View Student', icon: '👁️' },
    { path: '/faculty/upload-video', label: 'Student Attentivity', icon: '🎥' },
  ];

  const links = role === 'admin' ? adminLinks : facultyLinks;

  return (
    <div className="sidebar animate-sidebar">
      <h2 className="sidebar-title animate-title">{role === 'admin' ? 'Admin Panel' : 'Faculty Panel'}</h2>
      <ul className="sidebar-links">
        {links.map((link, index) => (
          <li key={index} className="sidebar-item animate-link" style={{ animationDelay: `${index * 0.1}s` }}>
            <NavLink
              to={link.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;