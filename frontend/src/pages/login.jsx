// frontend/src/pages/Login.jsx
import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '@context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/Login.css';

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const recaptchaRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Vérification du chargement de reCAPTCHA...');
    if (!window.grecaptcha) {
      console.error('reCAPTCHA script non chargé. Vérifiez la connexion réseau ou la clé de site.');
    } else {
      console.log('reCAPTCHA script chargé.');
      window.grecaptcha.ready(() => {
        console.log('reCAPTCHA prêt à être rendu.');
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const recaptchaToken = recaptchaRef.current?.getValue();
    console.log('Submitting login with:', { email, password, recaptchaToken });
    if (!recaptchaToken) {
      setError('Veuillez compléter le reCAPTCHA.');
      return;
    }

    try {
      await login(email, password, recaptchaToken);
      navigate('/taches');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError(error.message || 'Erreur lors de la connexion.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>Connexion</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <div className="recaptcha-container">
            <ReCAPTCHA
              sitekey="6Ldn1CcrAAAAAMkKoTuHPzPEoKdTXtqNm-JJrG5I" // Remplacez par la nouvelle clé
              ref={recaptchaRef}
              onChange={(token) => console.log('reCAPTCHA onChange:', token)}
              onErrored={() => console.error('Erreur de chargement reCAPTCHA')}
              onExpired={() => console.log('reCAPTCHA expiré')}
            />
          </div>
          <button type="submit" className="login-button">Se connecter</button>
        </form>
      </div>
    </div>
  );
}

export default Login;