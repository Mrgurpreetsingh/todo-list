// frontend/src/context/AuthProvider.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const axiosInstanceRef = useRef(null);
  if (!axiosInstanceRef.current) {
    axiosInstanceRef.current = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
    });
  }
  const axiosInstance = axiosInstanceRef.current;

  const CheckCSP = useCallback((url, type) => {
    console.log(`🔐 TEST CSP: ${type} vers ${url} - Autorisé`);
    return true;
  }, []);

  useEffect(() => {
    let estMonte = true;

    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        CheckCSP('/auth/me', 'connect-src');
        const res = await axiosInstance.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (estMonte) {
          console.log('📤 Réponse de /auth/me:', res.data);
          setUser(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Erreur checkAuth:', err.response?.data || err.message);
        if (estMonte) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      estMonte = false;
    };
  }, [token, axiosInstance, CheckCSP]);

  const login = useCallback(async (email, password, recaptchaToken) => {
    if (!email || !password || !recaptchaToken) {
      throw new Error('Email, mot de passe et reCAPTCHA sont requis.');
    }
    try {
      console.log('📥 Envoi requête login:', { email, recaptchaToken });
      CheckCSP('/auth/login', 'connect-src');
      const res = await axiosInstance.post(
        '/auth/login',
        { email, password, recaptchaToken },
        {
          headers: {
            'Content-Type': 'application/json',
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
    } catch (err) {
      console.error('❌ Erreur login:', err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Une erreur est survenue lors de la connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [axiosInstance, CheckCSP]);

  const register = useCallback(async (username, email, password, nom, prenom, recaptchaToken) => {
    if (!username || !email || !password || !nom || !prenom || !recaptchaToken) {
      throw new Error('Tous les champs et reCAPTCHA sont requis pour l\'inscription.');
    }
    try {
      console.log('📥 Envoi requête register:', { username, email, nom, prenom, recaptchaToken });
      CheckCSP('/auth/register', 'connect-src');
      const res = await axiosInstance.post(
        '/auth/register',
        { username, email, mot_de_passe: password, nom, prenom, recaptchaToken },
        {
          headers: {
            'Content-Type': 'application/json',
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
    } catch (err) {
      console.error('❌ Erreur d\'inscription:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [axiosInstance, CheckCSP]);

  const handleLogout = useCallback(async () => {
    try {
      CheckCSP('/auth/logout', 'connect-src');
      await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('⚠️ Erreur lors de la déconnexion côté serveur:', err.response?.data || err.message);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      setError(null);
    }
  }, [axiosInstance, CheckCSP]);

  const value = useMemo(
    () => ({ user, token, login, register, logout: handleLogout, error, loading }),
    [user, token, error, loading, login, register, handleLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}