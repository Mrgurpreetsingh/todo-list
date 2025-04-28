// frontend/src/pages/login.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '@context/AuthContext';
import FormContainer from '@component/FormContainer.jsx';

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting login with:', { email, password }); // Log des arguments
    try {
      await login(email, password);
      setError(null);
    } catch (err) {
      const errorMessage = err.message || 'Identifiants incorrects';
      setError(errorMessage);
      console.error('Erreur login:', err);
    }
  };

  return (
    <FormContainer title="Connexion" errorMessage={error}>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoComplete="email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
          autoComplete="current-password"
        />
        <button type="submit" className="form-button">Se connecter</button>
      </form>
    </FormContainer>
  );
}

export default Login;