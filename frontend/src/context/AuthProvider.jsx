// frontend/src/context/AuthProvider.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Instance Axios unique
  const axiosInstanceRef = useRef(null);
  if (!axiosInstanceRef.current) {
    axiosInstanceRef.current = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
    });
  }
  const axiosInstance = axiosInstanceRef.current;

  // test de vérification CSP alignée avec backend
  const CheckCSP = useCallback((url, type) => {
    const cspRules = {
      'connect-src': [
        "'self'",
        'https://www.google.com',
        'https://www.gstatic.com',
        'https://localhost:3000',
        'https://backend:3000',
      ],
    };
    const isAllowed = cspRules[type]?.some((source) => {
      if (source === "'self'") return url.startsWith('/');
      return url.includes(source.replace('https://', ''));
    }) ?? true;
    console.log(`🔐 TEST CSP: ${type} vers ${url} - ${isAllowed ? 'Autorisé' : 'Bloqué'}`);
    return isAllowed;
  }, []);

  // Vérification initiale de l'authentification
  useEffect(() => {
    let estMonte = true;

    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        if (!CheckCSP('/auth/me', 'connect-src')) {
          throw new Error('Requête bloquée par CSP');
        }
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

  // Fonction de connexion
  const login = useCallback(async (email, password, recaptchaToken) => {
    if (!email || !password || !recaptchaToken) {
      throw new Error('Email, mot de passe et reCAPTCHA sont requis.');
    }
    try {
      setError(null); // Réinitialiser l'erreur
      console.log('📥 Envoi requête login:', { email, recaptchaToken });
      if (!CheckCSP('/auth/login', 'connect-src')) {
        throw new Error('Requête bloquée par CSP');
      }
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
    } catch (err) {
      console.error('❌ Erreur login:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || 'Erreur lors de la connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [axiosInstance, CheckCSP]);

  // Fonction d'inscription
  const register = useCallback(async (username, email, password, nom, prenom, recaptchaToken) => {
    if (!username || !email || !password || !nom || !prenom || !recaptchaToken) {
      throw new Error('Tous les champs et reCAPTCHA sont requis pour l\'inscription.');
    }
    try {
      setError(null); // Réinitialiser l'erreur
      console.log('📥 Envoi requête register:', { username, email, nom, prenom, recaptchaToken });
      if (!CheckCSP('/auth/register', 'connect-src')) {
        throw new Error('Requête bloquée par CSP');
      }
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
    } catch (err) {
      console.error('❌ Erreur d\'inscription:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [axiosInstance, CheckCSP]);

  // Fonction de déconnexion
  const handleLogout = useCallback(async () => {
    try {
      if (!CheckCSP('/auth/logout', 'connect-src')) {
        throw new Error('Requête bloquée par CSP');
      }
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

  // Fonction pour mettre à jour l'utilisateur après modification du profil
  const updateUser = useCallback(async () => {
    try {
      if (!token) {
        throw new Error('Aucun token disponible');
      }
      if (!CheckCSP('/api/users/me', 'connect-src')) {
        throw new Error('Requête bloquée par CSP');
      }
      const res = await axiosInstance.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log('📤 Mise à jour utilisateur:', res.data);
      setUser(res.data);
    } catch (err) {
      console.error('❌ Erreur updateUser:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour de l\'utilisateur');
    }
  }, [axiosInstance, token, CheckCSP]);

  // Valeur du contexte mémoïsée
  const value = useMemo(
    () => ({ user, token, login, register, logout: handleLogout, updateUser, error, loading }),
    [user, token, error, loading, login, register, handleLogout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}