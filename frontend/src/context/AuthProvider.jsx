// frontend/src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) return;
      try {
        const csrfRes = await axios.get('/csrf-token', {
          withCredentials: true,
        });
        const csrfToken = csrfRes.data.csrfToken;

        const res = await axios.get('/auth/me', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    checkAuth();
  }, [token, navigate]);

  const login = async (email, password) => {
    try {
      const csrfRes = await axios.get('/csrf-token', {
        withCredentials: true,
      });
      const csrfToken = csrfRes.data.csrfToken;

      const res = await axios.post(
        '/auth/login',
        { email, password },
        {
          headers: { 
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      setError(null);
      navigate('/taches');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Identifiants incorrects';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (username, email, password, nom, prenom) => {
    try {
      const csrfRes = await axios.get('/csrf-token', {
        withCredentials: true,
      });
      const csrfToken = csrfRes.data.csrfToken;

      const res = await axios.post(
        '/auth/register',
        { username, email, mot_de_passe: password, nom, prenom },
        {
          headers: { 
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      setError(null);
      navigate('/taches');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erreur lors de l\'inscription';
      console.error('Erreur d\'inscription:', err.response?.data || err.message);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setError(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}