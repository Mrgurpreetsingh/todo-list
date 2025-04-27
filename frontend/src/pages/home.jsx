import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Bienvenue sur To-Do List</h1>
      <p>Gérez vos tâches personnelles</p>
      <Link to="/taches">Voir mes tâches</Link>
    </div>
  );
}

export default Home;
