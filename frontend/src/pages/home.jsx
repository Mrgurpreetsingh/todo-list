// Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext.jsx';
import '../styles/Home.css'; // Importer le nouveau fichier CSS

function Home() {
  const { token } = useContext(AuthContext); // Vérifier si l'utilisateur est connecté

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <h1>Bienvenue sur To-Do List</h1>
        <p>Gérez vos tâches personnelles</p>
        {token ? (
          <Link to="/taches">
            <button className="home-button">Voir mes tâches</button>
          </Link>
        ) : (
          <Link to="/login">
            <button className="home-button">Se connecter</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;
