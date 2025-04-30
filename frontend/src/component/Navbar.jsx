// frontend/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/Navbar.css';

function Navbar() {
  const { token, logout } = useContext(AuthContext); // Récupère token et logout depuis AuthContext
  const navigate = useNavigate();

  // Gestion de la déconnexion
  const handleLogout = () => {
    logout(); // Appelle la fonction de déconnexion
    navigate('/login'); // Redirige vers la page de connexion
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          To-Do List
        </Link>
        <div className="navbar-links">
          {token ? (
            <>
              <Link to="/taches" className="navbar-link">
                Mes Tâches
              </Link>
              <Link to="/profile" className="navbar-link">
                Profil
              </Link>
              <button className="navbar-button" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Connexion
              </Link>
              <Link to="/register" className="navbar-link">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;