import React, { useState, useContext } from 'react';
import { AuthContext } from '@context/AuthContext.jsx';
import FormContainer from '@component/FormContainer.jsx';// Importer le composant FormContainer
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <FormContainer title="Connexion" errorMessage={error} onSubmit={handleLogin}>
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
      <p>
        Pas encore de compte ? <Link to="/register">S'inscrire</Link>
      </p>
    </FormContainer>
  );
}

export default Login;
