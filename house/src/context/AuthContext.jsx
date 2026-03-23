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
      setUser(response.data.data || response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/login', {
      user: { email, password }
    });
    const token = response.headers.authorization;
    const userData = response.data.data || response.data.user;
    
    if (!userData) {
      throw new Error('No se recibieron datos del usuario del servidor.');
    }

    if (token) localStorage.setItem('token', token);
    setUser(userData);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.delete('/logout', { baseURL: `${API_URL}/api/v1` });
    } catch (error) {
      // Ignore logout errors
    }
    localStorage.removeItem('token');
    setUser(null);
  };
  const signup = async (userData) => {
    const response = await api.post('/signup', {
      user: userData
    });
    const token = response.headers.authorization;
    const userResponse = response.data.data || response.data.user;

    if (!userResponse) {
      throw new Error('No se recibieron datos del registro del servidor.');
    }

    if (token) localStorage.setItem('token', token);
    setUser(userResponse);
    return response.data;
  };

  const updateUser = (newData) => {
    setUser(newData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
