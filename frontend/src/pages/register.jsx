import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import FormContainer from '../component/FormContainer.jsx'; // Importer le composant FormContainer
import { Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [error, setError] = useState(null);
  const { register } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password, nom, prenom);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <FormContainer title="Inscription" errorMessage={error} onSubmit={handleRegister}>
      <label htmlFor="username">Nom d'utilisateur</label>
      <input
        id="username"
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        aria-invalid={error ? 'true' : 'false'}
      />
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        aria-invalid={error ? 'true' : 'false'}
      />
      <label htmlFor="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        aria-invalid={error ? 'true' : 'false'}
      />
      <label htmlFor="nom">Nom</label>
      <input
        id="nom"
        type="text"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <label htmlFor="prenom">Prénom</label>
      <input
        id="prenom"
        type="text"
        placeholder="Prénom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        required
      />
      <button type="submit">S'inscrire</button>
      <p>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </FormContainer>
  );
}

export default Register;
