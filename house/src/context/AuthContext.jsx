import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

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
    const response = await api.post('http://localhost:3000/login', {
      user: { email, password }
    });
    const token = response.headers.authorization;
    localStorage.setItem('token', token);
    setUser(response.data.data);
    return response.data;
  };

  const logout = async () => {
    await api.delete('http://localhost:3000/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  const signup = async (userData) => {
    const response = await api.post('http://localhost:3000/signup', {
      user: userData
    });
    const token = response.headers.authorization;
    localStorage.setItem('token', token);
    setUser(response.data.data);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
