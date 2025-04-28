// Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/Navbar.css';

function Navbar() {
  const { token, logout } = useContext(AuthContext); // Supposons que AuthContext fournit logout
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Appeler la fonction de déconnexion
    navigate('/login'); // Rediriger vers la page de connexion
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