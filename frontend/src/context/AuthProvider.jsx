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
      baseURL: import.meta.env.VITE_API_URL || 'https://localhost:3000',
      // httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
  }, []);

  // Fonction pour récupérer le CSRF token
  // const fetchCsrfToken = async () => {
  //   const res = await axiosInstance.get('/csrf-token', { withCredentials: true });
  //   return res.data.csrfToken;
  // };

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) return;
      try {
        // const csrfToken = await fetchCsrfToken();
        const res = await axiosInstance.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        });
        console.log('📤 Réponse de /auth/me:', res.data);
        setUser(res.data);
      } catch (err) {
        console.error('❌ Erreur checkAuth:', err.response?.data || err.message);
        setUser(null);
      }
    };
    checkAuth();
  }, [token, navigate, axiosInstance]);

  const login = async (email, password, recaptchaToken) => {
    if (!email || !password || !recaptchaToken) {
      throw new Error('Email, mot de passe et reCAPTCHA sont requis.');
    }
    try {
      console.log('📥 Envoi requête login:', { email, recaptchaToken });
      // const csrfToken = await fetchCsrfToken();
      const res = await axiosInstance.post(
        '/auth/login',
        { email, password, recaptchaToken },
        {
          headers: {
            'Content-Type': 'application/json',
            // 'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );
      console.log('📤 Login response data:', res.data);
      const { token: newToken, user } = res.data;
      setToken(newToken);
      setUser(user);
      localStorage.setItem('token', newToken);
      setError(null);
      navigate('/taches');
    } catch (err) {
      console.error('❌ Erreur login:', err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Une erreur est survenue lors de la connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (username, email, password, nom, prenom, recaptchaToken) => {
    if (!username || !email || !password || !nom || !prenom || !recaptchaToken) {
      throw new Error('Tous les champs et reCAPTCHA sont requis pour l\'inscription.');
    }
    try {
      console.log('📥 Envoi requête register:', { username, email, nom, prenom, recaptchaToken });
      // const csrfToken = await fetchCsrfToken();
      const res = await axiosInstance.post(
        '/auth/register',
        { username, email, mot_de_passe: password, nom, prenom, recaptchaToken },
        {
          headers: {
            'Content-Type': 'application/json',
            // 'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );
      console.log('📤 Register response data:', res.data);
      const { token: newToken, user } = res.data;
      setToken(newToken);
      setUser(user);
      localStorage.setItem('token', newToken);
      setError(null);
      navigate('/taches');
    } catch (err) {
      console.error('❌ Erreur d\'inscription:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('⚠️ Erreur lors de la déconnexion côté serveur:', err.response?.data || err.message);
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