// frontend/src/pages/register.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormContainer from '@component/FormContainer.jsx';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('/csrf-token', { withCredentials: true });
      return response.data.csrfToken;
    } catch (error) {
      console.error('Erreur CSRF:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = await fetchCsrfToken();
      const response = await axios.post(
        '/auth/register',
        { username, email, mot_de_passe: password, nom, prenom },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );
      localStorage.setItem('token', response.data.token);
      navigate('/taches');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erreur d\'inscription';
      setError(errorMessage);
      console.error('Erreur d\'inscription:', error);
    }
  };

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  return (
    <FormContainer title="Inscription" errorMessage={error}>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d'utilisateur"
          required
          autoComplete="username"
        />
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
          autoComplete="new-password"
        />
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom"
          required
          autoComplete="family-name"
        />
        <input
          type="text"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          placeholder="Prénom"
          required
          autoComplete="given-name"
        />
        <button type="submit" className="form-button">S'inscrire</button>
      </form>
    </FormContainer>
  );
}

export default Register;