// backend/server.js

// Importation des modules nécessaires
import express from 'express'; // Framework web pour créer l'API
import fs from 'fs'; // Module pour gérer les fichiers (certificats SSL)
import https from 'https'; // Module pour créer un serveur HTTPS
import session from 'express-session'; // Middleware pour gérer les sessions utilisateur
import cookieParser from 'cookie-parser'; // Middleware pour parser les cookies
import authRoutes from './routes/auth.routes.js'; // Routes pour l'authentification (/auth)
import taskRoutes from './routes/tache.routes.js'; // Routes pour les tâches (/tasks)
import userRoutes from './routes/userRoutes.js'; // Routes pour la gestion des utilisateurs (/api/users)
import cors from 'cors'; // Middleware pour gérer les requêtes cross-origin
import helmet from 'helmet'; // Middleware pour sécuriser les en-têtes HTTP
import rateLimit from 'express-rate-limit'; // Middleware pour limiter le nombre de requêtes

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000; // Port du serveur (défaut: 3000)

// Déterminer si l'environnement est en production
const isProduction = process.env.NODE_ENV === 'production';
console.log(`🌍 Environnement: ${isProduction ? 'Production' : 'Développement'}`);

// Activer 'trust proxy' pour gérer l'en-tête X-Forwarded-For utilisé par Nginx
// Corrige l'erreur express-rate-limit liée à la détection des IP via un proxy
app.set('trust proxy', 1);

// Configuration du rate limiting global
// Limite le nombre de requêtes par IP pour éviter les abus
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: isProduction ? 100 : 5000, // 100 requêtes en prod, 5000 en dev
  message: 'Trop de requêtes, réessayez plus tard.',
  standardHeaders: true, // Utilise les en-têtes RateLimit standard
  legacyHeaders: false, // Désactive les anciens en-têtes
});

// Configuration du rate limiting spécifique pour /auth
// Protège les endpoints d'authentification contre les attaques par force brute
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: isProduction ? 100 : 5000, // 100 requêtes en prod, 5000 en dev
  message: 'Trop de tentatives de connexion, réessayez plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de test CSP (Content Security Policy)
// test une politique CSP pour logger les accès aux ressources
const TestCSP = (req, res, next) => {
  const cspRules = {
    'connect-src': [
      "'self'", // Autorise les connexions au même domaine
      'https://www.google.com', // Pour reCAPTCHA
      'https://www.gstatic.com', // Pour reCAPTCHA
      'https://localhost:3000', // Backend local
      'https://backend:3000', // Backend dans Docker
    ],
    'script-src': [
      "'self'", // Autorise les scripts du même domaine
      'https://www.google.com', // Pour reCAPTCHA
      'https://www.gstatic.com', // Pour reCAPTCHA
      "'unsafe-inline'", // Autorise les scripts inline (à éviter en prod)
    ],
  };
  const url = req.url;
  const isConnectAllowed = cspRules['connect-src'].some((source) => {
    if (source === "'self'") return url.startsWith('/');
    return url.includes(source.replace('https://', ''));
  });
  console.log(`🔐 TEST CSP: connect-src vers ${url} - ${isConnectAllowed ? 'Autorisé' : 'Bloqué'}`);
  next();
};

// Configuration de Helmet pour sécuriser les en-têtes HTTP
app.use(helmet({
  contentSecurityPolicy: false, // CSP désactivé pour les tests (activé via TestCSP)
  hsts: {
    maxAge: 0, // Désactive HSTS en développement pour éviter les problèmes HTTPS
  },
}));

// Appliquer le rate limiting global
// En développement, utilise une limite élevée pour faciliter les tests
if (isProduction) {
  app.use(limiter);
} else {
  console.log('⚠️ Rate limiting désactivé ou augmenté en environnement de développement');
  app.use(limiter); // Limite élevée (5000 requêtes) en dev
}

// Appliquer le middleware de test CSP
app.use(TestCSP);

// Vérification des certificats SSL pour HTTPS
const certPath = '/usr/src/app/certs/backend';
if (!fs.existsSync(`${certPath}/backend-cert.pem`) || 
    !fs.existsSync(`${certPath}/backend-key.pem`)) {
  console.error('🚨 Certificats SSL manquants ou inaccessibles.');
  process.exit(1);
}

// Chargement des certificats SSL
const privateKey = fs.readFileSync(`${certPath}/backend-key.pem`, 'utf8');
const certificate = fs.readFileSync(`${certPath}/backend-cert.pem`, 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Middlewares de base
app.use(express.json()); // Parse les corps de requêtes JSON
app.use(cookieParser()); // Parse les cookies
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'votre_secret_session_ici', // Clé secrète pour signer les sessions
    resave: false, // Ne sauvegarde pas la session si non modifiée
    saveUninitialized: false, // Ne crée pas de session pour les requêtes anonymes
    cookie: {
      secure: isProduction, // Cookies sécurisés en HTTPS en prod
      httpOnly: true, // Empêche l'accès aux cookies via JavaScript
      sameSite: 'lax', // Protège contre les attaques CSRF
    },
  })
);

// Configuration CORS pour autoriser les requêtes du frontend
app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:5173', // Frontend Vite
    'https://localhost:5173',
    'https://localhost',
    'https://frontend', // Nom du service Docker
  ],
  credentials: true, // Autorise l'envoi de cookies et d'en-têtes d'authentification
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
}));

// Routes de l'API
// Routes pour les tâches (/tasks)
// Middleware CSRF uniquement pour /tasks (désactivé temporairement)
// const csrfProtection = csrf({ cookie: { httpOnly: true, secure: false } });

app.use('/tasks', taskRoutes);// Corriger ici : ajouter taskRoutes


// app.get('/csrf-token', (req, res) => {
//   console.log('Requête /csrf-token reçue, envoi du jeton:', req.csrfToken ? req.csrfToken() : 'disabled');
//   res.json({ csrfToken: req.csrfToken ? req.csrfToken() : 'disabled' });
// });


// Routes pour l'authentification (/auth) avec rate limiting en prod
if (isProduction) {
  app.use('/auth', authLimiter, authRoutes);
} else {
  app.use('/auth', authRoutes); // Pas de limitation stricte en dev
}


// Routes pour la gestion des utilisateurs (/api/users)
app.use('/api/users', userRoutes);

// Middleware de journalisation des requêtes
// Logue les détails des requêtes et réponses pour le débogage
app.use((req, res, next) => {
  console.log('📥 Requête reçue:', req.method, req.url, req.headers.authorization ? 'Token présent' : 'Pas de token');
  const oldWrite = res.write;
  res.write = function (data) {
    console.log('📤 Écriture dans res:', data.toString());
    return oldWrite.apply(res, arguments);
  };
  const oldJson = res.json;
  res.json = function (data) {
    console.log('📤 Réponse JSON:', JSON.stringify(data));
    return oldJson.apply(res, arguments);
  };
  next();
});

// Gestion des erreurs globales
// app.use((err, req, res, next) => {
//   if (err.code === 'EBADCSRFTOKEN') {
//     console.error('Erreur CSRF:', {
//       token: req.headers['x-csrf-token'],
//       session: req.session,
//       body: req.body,
//     });
//     res.status(403).json({ error: 'Invalid CSRF token' });
//   } else {
//     next(err);
//   }
// });

// Capture les erreurs non gérées et renvoie une réponse 500
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.stack);
  res.status(500).json({ error: 'Une erreur est survenue.' });
});

// Création et démarrage du serveur HTTPS
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`✅ Serveur démarré sur https://localhost:${PORT}`);
});