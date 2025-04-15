import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  const login = async (email, password, role) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setUser({ role: res.data.role });
      return res.data.role;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    setTheme('light'); // Reset to light on logout
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, theme, toggleTheme }}>
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </AuthContext.Provider>
  );
};