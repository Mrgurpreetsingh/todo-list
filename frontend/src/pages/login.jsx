import { useContext, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import FormContainer from '@component/FormContainer.jsx';
import '../styles/login.css';

// Schéma de validation avec Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Adresse email invalide')
    .required('L\'email est requis'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
});

function Login() {
  const { login } = useContext(AuthContext);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState(null);

  useEffect(() => {
    console.log('Démarrage vérification reCAPTCHA...');
    try {
      if (window.grecaptcha) {
        console.log('reCAPTCHA script détecté.');
        window.grecaptcha.ready(() => {
          console.log('reCAPTCHA prêt à être rendu.');
          setRecaptchaLoaded(true);
        });
      } else {
        console.error('reCAPTCHA script non chargé.');
        setRecaptchaError('Erreur de chargement reCAPTCHA.');
      }
    } catch (err) {
      console.error('Erreur dans useEffect reCAPTCHA:', err);
      setRecaptchaError('Erreur lors de l\'initialisation de reCAPTCHA.');
    }
  }, []);

  // const fetchCsrfToken = async () => {
  //   try {
  //     const response = await axios.get('/csrf-token', { withCredentials: true });
  //     return response.data.csrfToken;
  //   } catch (error) {
  //     console.error('Erreur CSRF:', error);
  //     throw error;
  //   }
  // };

  return (
    <FormContainer title="Connexion">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const recaptchaToken = recaptchaRef.current?.getValue();
            if (!recaptchaToken) {
              setStatus({ error: 'Veuillez compléter le reCAPTCHA' });
              return;
            }
            console.log('📥 Envoi requête login:', { email: values.email, recaptchaToken });
            // const csrfToken = await fetchCsrfToken();
            await login(values.email, values.password, recaptchaToken);
            console.log('📤 Connexion réussie, redirection vers /taches');
            navigate('/taches');
          } catch (error) {
            const errorMessage = error.message || 'Erreur lors de la connexion';
            setStatus({ error: errorMessage });
            console.error('❌ Erreur lors de la connexion:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status, errors, touched }) => (
          <Form className="form">
            {status && status.error && (
              <div className="error-message">{status.error}</div>
            )}
            {recaptchaError && (
              <div className="error-message">{recaptchaError}</div>
            )}
            <div className="form-group">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className={`login-input ${errors.email && touched.email ? 'input-error' : ''}`}
                autoComplete="email"
              />
              <ErrorMessage name="email" component="div" className="field-error" />
            </div>
            <div className="form-group">
              <Field
                type="password"
                name="password"
                placeholder="Mot de passe"
                className={`login-input ${errors.password && touched.password ? 'input-error' : ''}`}
                autoComplete="current-password"
              />
              <ErrorMessage name="password" component="div" className="field-error" />
            </div>
            <div className="recaptcha-container">
              {recaptchaLoaded ? (
                <ReCAPTCHA
                  sitekey="6Le5zycrAAAAAEw1VI0MQXUoFVayvReOLwJYxtCI"
                  ref={recaptchaRef}
                  onChange={(token) => console.log('reCAPTCHA onChange:', token)}
                  onErrored={(err) => {
                    console.error('Erreur reCAPTCHA:', err);
                    setRecaptchaError('Erreur de chargement du reCAPTCHA.');
                  }}
                  onExpired={() => {
                    console.log('reCAPTCHA expiré');
                    setRecaptchaError('Le reCAPTCHA a expiré.');
                  }}
                />
              ) : (
                <div>Chargement du reCAPTCHA...</div>
              )}
            </div>
            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
}

export default Login;