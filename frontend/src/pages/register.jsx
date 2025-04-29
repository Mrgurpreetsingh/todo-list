import { useContext, useRef, useEffect, useState } from 'react';
     import { useNavigate } from 'react-router-dom';
     import { AuthContext } from '@context/AuthContext.jsx';
     import { Formik, Form, Field, ErrorMessage } from 'formik';
     import * as Yup from 'yup';
     import ReCAPTCHA from 'react-google-recaptcha';
     import FormContainer from '@component/FormContainer.jsx';
     import '../styles/login.css';

     // Schéma de validation avec Yup
     const RegisterSchema = Yup.object().shape({
       username: Yup.string()
         .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
         .required('Le nom d\'utilisateur est requis'),
       email: Yup.string()
         .email('Adresse email invalide')
         .required('L\'email est requis'),
       password: Yup.string()
         .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
         .required('Le mot de passe est requis'),
       nom: Yup.string().required('Le nom est requis'),
       prenom: Yup.string().required('Le prénom est requis'),
     });

     function Register() {
       const { register } = useContext(AuthContext);
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
         <FormContainer title="Inscription">
           <Formik
             initialValues={{ username: '', email: '', password: '', nom: '', prenom: '' }}
             validationSchema={RegisterSchema}
             onSubmit={async (values, { setSubmitting, setStatus }) => {
               try {
                 const recaptchaToken = recaptchaRef.current?.getValue();
                 if (!recaptchaToken) {
                   setStatus({ error: 'Veuillez compléter le reCAPTCHA' });
                   return;
                 }
                 console.log('📥 Envoi requête register:', { ...values, recaptchaToken });
                 // const csrfToken = await fetchCsrfToken();
                 await register(values.username, values.email, values.password, values.nom, values.prenom, recaptchaToken);
                 console.log('📤 Inscription réussie, redirection vers /taches');
                 navigate('/taches');
               } catch (error) {
                 const errorMessage = error.message || 'Erreur d\'inscription';
                 setStatus({ error: errorMessage });
                 console.error('❌ Erreur d\'inscription:', error);
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
                     type="text"
                     name="username"
                     placeholder="Nom d'utilisateur"
                     className={`login-input ${errors.username && touched.username ? 'input-error' : ''}`}
                     autoComplete="username"
                   />
                   <ErrorMessage name="username" component="div" className="field-error" />
                 </div>
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
                     autoComplete="new-password"
                   />
                   <ErrorMessage name="password" component="div" className="field-error" />
                 </div>
                 <div className="form-group">
                   <Field
                     type="text"
                     name="nom"
                     placeholder="Nom"
                     className={`login-input ${errors.nom && touched.nom ? 'input-error' : ''}`}
                     autoComplete="family-name"
                   />
                   <ErrorMessage name="nom" component="div" className="field-error" />
                 </div>
                 <div className="form-group">
                   <Field
                     type="text"
                     name="prenom"
                     placeholder="Prénom"
                     className={`login-input ${errors.prenom && touched.prenom ? 'input-error' : ''}`}
                     autoComplete="given-name"
                   />
                   <ErrorMessage name="prenom" component="div" className="field-error" />
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
                   {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
                 </button>
               </Form>
             )}
           </Formik>
         </FormContainer>
       );
     }

     export default Register;