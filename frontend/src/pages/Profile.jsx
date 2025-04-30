// frontend/src/pages/Profile.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '@context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Composant Profile pour gérer le profil utilisateur
const Profile = () => {
  // Récupération des données du contexte d'authentification
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    mot_de_passe: '',
  });

  // État pour gérer les erreurs
  const [error, setError] = useState(null);

  // Gestion de la mise à jour du profil
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/me', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      await updateUser(); // Rafraîchir les données utilisateur
      alert('Profil mis à jour avec succès');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  };

  // Gestion de la suppression du compte
  const handleDelete = async () => {
    if (window.confirm('Voulez-vous vraiment supprimer votre compte ?')) {
      try {
        await axios.delete('/api/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        logout();
        alert('Compte supprimé');
        navigate('/login');
      } catch (err) {
        setError(err.response?.data?.error || 'Erreur lors de la suppression');
      }
    }
  };

  return (
    <div>
      <h1>Mon Profil</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleUpdate}>
        <label>
          Nom:
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          />
        </label>
        <label>
          Prénom:
          <input
            type="text"
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </label>
        <label>
          Mot de passe (laisser vide pour ne pas modifier):
          <input
            type="password"
            value={formData.mot_de_passe}
            onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}
          />
        </label>
        <button type="submit">Mettre à jour</button>
      </form>
      <button onClick={handleDelete} style={{ marginTop: '20px', color: 'red' }}>
        Supprimer mon compte
      </button>
    </div>
  );
};

export default Profile;