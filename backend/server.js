import express from 'express';
import fs from 'fs';
import https from 'https';
import session from 'express-session';
import cookieParser from 'cookie-parser';
// import csrf from 'csurf';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/tache.routes.js';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3000;

// Déterminer l'environnement
const isProduction = process.env.NODE_ENV === 'production';

// Limiter adapté selon l'environnement
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 5000, // 100 en prod, 5000 en dev
  message: 'Trop de requêtes, réessayez plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter pour /auth adapté selon l'environnement
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 5000, // 100 en prod, 5000 en dev
  message: 'Trop de tentatives de connexion, réessayez plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

// test CSP
const TestCSP = (req, res, next) => {
  const cspRules = {
    'connect-src': [
      "'self'",
      'https://www.google.com',
      'https://www.gstatic.com',
      'https://localhost:3000',
      'https://backend:3000',
    ],
    'script-src': [
      "'self'",
      'https://www.google.com',
      'https://www.gstatic.com',
      "'unsafe-inline'",
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

app.use(helmet({
  contentSecurityPolicy: false, // Désactiver CSP pour les tests
  hsts: {
    maxAge: 0, // Désactiver HSTS en développement
  },
}));

// Appliquer le rate limiting uniquement en production ou conditionnellement
if (isProduction) {
  app.use(limiter);
} else {
  console.log('⚠️ Rate limiting désactivé ou augmenté en environnement de développement');
  // En dev, on peut soit le désactiver complètement, soit utiliser un limiter avec des valeurs très hautes
  app.use(limiter); // Les valeurs ont déjà été augmentées selon l'environnement
}

app.use(TestCSP); // Appliquer la simulation CSP

const certPath = '/usr/src/app/certs/backend';
if (!fs.existsSync(`${certPath}/backend-cert.pem`) || 
    !fs.existsSync(`${certPath}/backend-key.pem`)) {
  console.error('Certificats SSL manquants ou inaccessibles.');
  process.exit(1);
}

const privateKey = fs.readFileSync(`${certPath}/backend-key.pem`, 'utf8');
const certificate = fs.readFileSync(`${certPath}/backend-cert.pem`, 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'votre_secret_session_ici',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: isProduction, httpOnly: true, sameSite: 'lax' },
  })
);
app.use(cors({
  origin: ['http://localhost', 'http://localhost:5173', 'https://localhost:5173', 'https://localhost', 'https://frontend'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization' /*, 'X-CSRF-Token'*/],
}));

// Middleware CSRF uniquement pour /tasks (désactivé temporairement)
// const csrfProtection = csrf({ cookie: { httpOnly: true, secure: false } });
app.use('/tasks', taskRoutes); // Corriger ici : ajouter taskRoutes

// app.get('/csrf-token', (req, res) => {
//   console.log('Requête /csrf-token reçue, envoi du jeton:', req.csrfToken ? req.csrfToken() : 'disabled');
//   res.json({ csrfToken: req.csrfToken ? req.csrfToken() : 'disabled' });
// });

// Appliquer le rate limiting d'auth conditionnellement aussi
if (isProduction) {
  app.use('/auth', authLimiter, authRoutes);
} else {
  app.use('/auth', authRoutes); // Sans limitation en développement, ou avec une limitation très haute
}

// Cette ligne est potentiellement redondante si déjà définie plus haut
// app.use('/tasks', taskRoutes);

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

app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.stack);
  res.status(500).json({ error: 'Une erreur est survenue.' });
});

https.createServer(credentials, app).listen(PORT, () => {
  console.log(`✅ Serveur démarré sur https://localhost:${PORT}`);
});