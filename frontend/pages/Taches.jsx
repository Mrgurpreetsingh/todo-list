import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Taches() {
  const [taches, setTaches] = useState([]);

  useEffect(() => {
    const fetchTaches = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/taches', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTaches(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches');
      }
    };

    fetchTaches();
  }, []);

  return (
    <div>
      <h2>Liste des tâches</h2>
      <ul>
        {taches.map((tache) => (
          <li key={tache.id_tache}>{tache.titre}</li>
        ))}
      </ul>
    </div>
  );
}

export default Taches;
