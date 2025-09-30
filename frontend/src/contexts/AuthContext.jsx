import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    console.log('useEffect token:', token);
    if (token) {
      api.getProfile(token)
        .then(data => {
          console.log('Profile data:', data);
          if (data.id) {
            setUser(data);
          } else {
            logout();
          }
        })
        .catch(() => logout());
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    console.log('Login data:', data);
    if (data.token) {
      console.log('Setting user:', data.user);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    const data = await api.register({ name, email, password, role });
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } else {
      return { success: false, message: data.errors ? data.errors[0].msg : data.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};