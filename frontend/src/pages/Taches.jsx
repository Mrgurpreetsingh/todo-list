import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

function Taches() {
  const { token } = useContext(AuthContext);
  const [taches, setTaches] = useState([]);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);

  // Récupérer le jeton CSRF
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://localhost:3000'}/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(res.data.csrfToken);
      } catch (error) {
        console.error('Erreur lors de la récupération du jeton CSRF:', error);
        setError('Impossible de récupérer le jeton CSRF.');
      }
    };
    fetchCsrfToken();
  }, []);

  // Configurer Axios avec JWT et CSRF
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:3000',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-CSRF-Token': csrfToken,
    },
    withCredentials: true,
  });

  // Charger les tâches avec useCallback
  const fetchTaches = useCallback(async () => {
    if (!csrfToken) {
      setError('Jeton CSRF non disponible.');
      return;
    }
    try {
      console.log('Tentative de récupération des tâches...');
      const res = await axiosInstance.get('/api/taches');
      console.log('Tâches récupérées:', res.data);
      setTaches(res.data);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      setError('Impossible de charger les tâches.');
    }
  }, [axiosInstance, csrfToken]);

  useEffect(() => {
    if (token && csrfToken) {
      fetchTaches();
    } else {
      setError('Vous devez être connecté et avoir un jeton CSRF pour voir les tâches.');
    }
  }, [token, csrfToken, fetchTaches]);

  const handleAjouterTache = async (e) => {
    e.preventDefault();
    if (!csrfToken) {
      setError('Jeton CSRF non disponible.');
      return;
    }
    try {
      console.log('Ajout de la tâche:', { titre, description });
      await axiosInstance.post('/api/taches', {
        titre,
        description,
      });
      setTitre('');
      setDescription('');
      fetchTaches();
      setError(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
      setError('Impossible d\'ajouter la tâche.');
    }
  };

  const handleSupprimerTache = async (id) => {
    if (!csrfToken) {
      setError('Jeton CSRF non disponible.');
      return;
    }
    try {
      console.log('Suppression de la tâche:', id);
      await axiosInstance.delete(`/api/taches/${id}`);
      fetchTaches();
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      setError('Impossible de supprimer la tâche.');
    }
  };

  const handleToggleComplete = async (id, est_complete) => {
    if (!csrfToken) {
      setError('Jeton CSRF non disponible.');
      return;
    }
    try {
      console.log('Mise à jour de la tâche:', id, { est_complete: !est_complete });
      await axiosInstance.put(`/api/taches/${id}`, {
        est_complete: !est_complete,
      });
      fetchTaches();
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      setError('Impossible de mettre à jour la tâche.');
    }
  };

  return (
    <div className="container">
      <h1>Mes Tâches</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAjouterTache}>
        <input
          type="text"
          placeholder="Titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {taches.map((tache) => (
          <li key={tache.id_tache}>
            <h3
              style={{
                textDecoration: tache.est_complete ? 'line-through' : 'none',
              }}
            >
              {tache.titre}
            </h3>
            <p>{tache.description}</p>
            <button
              onClick={() =>
                handleToggleComplete(tache.id_tache, tache.est_complete)
              }
            >
              {tache.est_complete
                ? 'Marquer comme incomplète'
                : 'Marquer comme complète'}
            </button>
            <button onClick={() => handleSupprimerTache(tache.id_tache)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Taches;