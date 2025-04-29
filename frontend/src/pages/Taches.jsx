import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import https from 'https';
import { AuthContext } from '@context/AuthContext.jsx';
import '../styles/Taches.css';

function Taches() {
  const { token, user } = useContext(AuthContext);
  const [taches, setTaches] = useState([]);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [priorite_id, setPrioriteId] = useState('1');
  const [error, setError] = useState(null);
  // const [csrfToken, setCsrfToken] = useState(null);

  // useEffect(() => {
  //   const fetchCsrfToken = async () => {
  //     try {
  //       const apiUrl = import.meta.env.VITE_API_URL || 'https://localhost:3000';
  //       const res = await axios.get(`${apiUrl}/csrf-token`, {
  //         withCredentials: true,
  //       });
  //       console.log('CSRF token:', res.data.csrfToken);
  //       setCsrfToken(res.data.csrfToken);
  //     } catch (error) {
  //       console.error('Erreur lors de la récupération du jeton CSRF:', error);
  //       setCsrfToken('disabled'); // Accepter 'disabled' comme fallback
  //     }
  //   };
  //   fetchCsrfToken();
  // }, []);

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://localhost:3000',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        Authorization: `Bearer ${token}`,
        // 'X-CSRF-Token': csrfToken || 'disabled',
      },
      withCredentials: true,
    });
  }, [token /*, csrfToken*/]);

  const fetchTaches = useCallback(async () => {
    try {
      console.log('📥 Tentative de récupération des tâches...');
      const res = await axiosInstance.get('/tasks');
      console.log('📤 Tâches récupérées:', res.data);
      setTaches(res.data);
      setError(null);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des tâches:', error);
      setError('Impossible de charger les tâches.');
    }
  }, [axiosInstance]);

  useEffect(() => {
    if (token /*&& csrfToken !== null*/) {
      fetchTaches();
    } else {
      setError('Vous devez être connecté pour voir les tâches.');
    }
  }, [token, fetchTaches]);

  const handleAjouterTache = async (e) => {
    e.preventDefault();
    try {
      console.log('📥 Ajout de la tâche:', { titre, description, priorite_id });
      await axiosInstance.post('/tasks', {
        titre,
        description,
        priorite_id: parseInt(priorite_id),
      });
      setTitre('');
      setDescription('');
      setPrioriteId('1');
      await fetchTaches();
      setError(null);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout de la tâche:', error);
      setError('Impossible d\'ajouter la tâche.');
    }
  };

  const handleSupprimerTache = async (id) => {
    try {
      console.log('📥 Suppression de la tâche:', id);
      await axiosInstance.delete(`/tasks/${id}`);
      await fetchTaches();
      setError(null);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la tâche:', error);
      setError('Impossible de supprimer la tâche.');
    }
  };

  const handleToggleComplete = async (id, est_complete) => {
    try {
      console.log('📥 Mise à jour de la tâche:', id, { est_complete: !est_complete });
      await axiosInstance.put(`/tasks/${id}`, {
        est_complete: !est_complete,
      });
      await fetchTaches();
      setError(null);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la tâche:', error);
      setError('Impossible de mettre à jour la tâche.');
    }
  };

  console.log('Tâches rendues:', taches);

  return (
    <div className="taches-wrapper">
      <div className="welcome-message">
        Bienvenue, {user?.username || 'Utilisateur'}
      </div>
      <div className="taches-container">
        <h1>Mes Tâches</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleAjouterTache} className="taches-form">
          <input
            type="text"
            placeholder="Titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
            className="taches-input"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="taches-textarea"
          />
          <select
            value={priorite_id}
            onChange={(e) => setPrioriteId(e.target.value)}
            className="taches-select"
          >
            <option value="1">Basse</option>
            <option value="2">Moyenne</option>
            <option value="3">Haute</option>
          </select>
          <button type="submit" className="taches-button">Ajouter</button>
        </form>
        <ul className="taches-list">
          {taches.map((tache) => (
            <li key={tache.id_tache} className="tache-item">
              <h3
                style={{
                  textDecoration: tache.est_complete ? 'line-through' : 'none',
                }}
              >
                {tache.titre}
              </h3>
              <p>{tache.description}</p>
              <p>Priorité: {tache.priorite_niveau || 'Aucune'}</p>
              <button
                onClick={() =>
                  handleToggleComplete(tache.id_tache, tache.est_complete)
                }
                className="taches-button"
              >
                {tache.est_complete
                  ? 'Marquer comme incomplète'
                  : 'Marquer comme complète'}
              </button>
              <button
                onClick={() => handleSupprimerTache(tache.id_tache)}
                className="taches-button taches-button-delete"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Taches;