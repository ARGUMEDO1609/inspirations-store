import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkUser();
    } else {
      setLoading(false);
    }
  }, []);

  const checkUser = async () => {
    try {
      const response = await api.get('/current_user');
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/users/sign_in', {
      user: { email, password }
    });
    const token = response.headers.authorization;
    localStorage.setItem('token', token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.delete('/users/sign_out');
    } catch (error) {
      // Ignore logout errors
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  const signup = async (userData) => {
    const response = await api.post('/users', {
      user: userData
    });
    const token = response.headers.authorization;
    localStorage.setItem('token', token);
    setUser(response.data.user);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
