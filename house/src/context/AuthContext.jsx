import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { resetCableConsumer } from '../api/cable';

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const response = await api.get('/current_user');
      const userData = response.data.data;
      setUser(userData?.attributes || userData || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // On mount: validate the session cookie against /current_user. The cookie is
  // attached automatically because axios has withCredentials:true. No
  // localStorage token lookup anymore.
  useEffect(() => {
    checkUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/login', {
      user: { email, password }
    });
    const userData = response.data.data?.attributes || response.data.data || response.data;

    if (!userData) {
      throw new Error('No se recibieron datos del usuario del servidor.');
    }

    // The server Set-Cookie response header establishes the session; nothing
    // to persist client-side.
    resetCableConsumer();
    setUser(userData);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.delete('/logout');
    } catch {
      // Ignore logout errors
    }
    resetCableConsumer();
    setUser(null);
  };

  const signup = async (userData) => {
    const response = await api.post('/signup', {
      user: userData
    });
    const userResponse = response.data.data?.attributes || response.data.data || response.data;

    if (!userResponse) {
      throw new Error('No se recibieron datos del registro del servidor.');
    }

    resetCableConsumer();
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
