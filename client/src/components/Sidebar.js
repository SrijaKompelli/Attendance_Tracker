import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(true);

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

  const toggleSidebar = () => {
    if (animationComplete) {
      setAnimationComplete(false);
      setCollapsed(!collapsed);
      
      // Re-enable toggle after animation completes
      setTimeout(() => {
        setAnimationComplete(true);
      }, 300); // Match this with CSS transition time
    }
  };

  // Initialize sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !collapsed) {
        setCollapsed(true);
      }
    };
    
    // Check on initial load
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);

  return (
    <>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            {role === 'admin' ? 'Admin Panel' : 'Faculty Panel'}
          </h2>
          <button 
            className={`sidebar-toggle ${collapsed ? 'rotated' : ''}`} 
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
        </div>
        
        <div className="sidebar-content">
          <ul className="sidebar-links">
            {links.map((link, index) => (
              <li 
                key={index} 
                className="sidebar-item" 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">{link.icon}</span>
                  <span className="sidebar-label">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Extra toggle button for collapsed state */}
      {/* <button 
        className={`sidebar-floating-toggle ${collapsed ? 'visible' : ''}`}
        onClick={toggleSidebar}
        aria-label="Expand sidebar"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button> */}
      
      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${collapsed ? '' : 'active'}`} 
        onClick={toggleSidebar}
      ></div>
    </>
  );
};

export default Sidebar;