// frontend/src/context/AuthProvider.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Instance axios stable
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://localhost:3001',
    });
  }, []);

  // Fonction pour récupérer le CSRF token
  const fetchCsrfToken = async () => {
    const res = await axiosInstance.get('/csrf-token', { withCredentials: true });
    return res.data.csrfToken;
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) return;
      try {
        const csrfToken = await fetchCsrfToken();
        const res = await axiosInstance.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error('Erreur checkAuth:', err.response?.data || err.message);
        handleLogout();
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const login = async (email, password, recaptchaToken) => {
    if (!email || !password || !recaptchaToken) {
      throw new Error('Email, mot de passe et reCAPTCHA sont requis.');
    }
    try {
      const csrfToken = await fetchCsrfToken();
      const res = await axiosInstance.post(
        '/auth/login',
        { email, password, recaptchaToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );
      const { token: newToken, user } = res.data;
      setToken(newToken);
      setUser(user);
      localStorage.setItem('token', newToken);
      setError(null);
      navigate('/taches');
    } catch (err) {
      console.error('Erreur login:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || 'Identifiants incorrects';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (username, email, password, nom, prenom) => {
    if (!username || !email || !password || !nom || !prenom) {
      throw new Error('Tous les champs sont requis pour l\'inscription.');
    }
    try {
      const csrfToken = await fetchCsrfToken();
      const res = await axiosInstance.post(
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
      const { token: newToken, user } = res.data;
      setToken(newToken);
      setUser(user);
      localStorage.setItem('token', newToken);
      setError(null);
      navigate('/taches');
    } catch (err) {
      console.error('Erreur d\'inscription:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('Erreur lors de la déconnexion côté serveur:', err.response?.data || err.message);
      // On continue même si ça échoue côté serveur
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      setError(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout: handleLogout, error }}>
      {children}
    </AuthContext.Provider>
  );
}
