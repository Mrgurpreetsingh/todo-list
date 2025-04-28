import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data.user))
        .catch(() => {
          setToken(null);
          localStorage.removeItem('token');
          navigate('/login');
        });
    }
  }, [token, navigate]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', {
        email,
        password,
      });
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      navigate('/taches');
    } catch (error) {
      console.error('Erreur de connexion', error);
      throw new Error('Identifiants incorrects');
    }
  };

  const register = async (username, email, password, nom, prenom) => {
    try {
      // Récupérer le jeton CSRF
      const csrfRes = await axios.get('/csrf-token');
      const csrfToken = csrfRes.data.csrfToken;

      // Envoyer la requête d'inscription
      const res = await axios.post(
        '/auth/register',
        {
          username,
          email,
          mot_de_passe: password,
          nom,
          prenom,
        },
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        }
      );
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      navigate('/taches');
    } catch (error) {
      console.error('Erreur d\'inscription:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Erreur lors de l\'inscription');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};