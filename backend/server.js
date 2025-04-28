// backend/server.js
import express from 'express';
import fs from 'fs';
import https from 'https';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/tache.routes.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Vérification des certificats SSL
const certPath = '/usr/src/app/certs/backend';
if (!fs.existsSync(`${certPath}/backend-cert.pem`) || 
    !fs.existsSync(`${certPath}/backend-key.pem`)) {
  console.error('Certificats SSL manquants ou inaccessibles.');
  process.exit(1);
}

// Chargement des certificats
const privateKey = fs.readFileSync(`${certPath}/backend-key.pem`, 'utf8');
const certificate = fs.readFileSync(`${certPath}/backend-cert.pem`, 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Déterminer l'environnement
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'votre_secret_session_ici',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: isProduction, httpOnly: true },
  })
);
app.use(cors({
  origin: ['http://localhost', 'http://localhost:5173', 'https://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));

// Middleware CSRF
const csrfProtection = csrf({ cookie: { httpOnly: true, secure: isProduction } });
app.use(csrfProtection);

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Route pour obtenir le jeton CSRF
app.get('/csrf-token', (req, res) => {
  console.log('Requête /csrf-token reçue, envoi du jeton:', req.csrfToken());
  res.json({ csrfToken: req.csrfToken() });
});

// Middleware d'erreur CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('Erreur CSRF:', {
      token: req.headers['x-csrf-token'],
      session: req.session,
      body: req.body,
    });
    res.status(403).json({ error: 'Invalid CSRF token' });
  } else {
    next(err);
  }
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ error: 'Une erreur est survenue.' });
});

// Démarrage du serveur HTTPS
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`✅ Serveur démarré sur https://localhost:${PORT}`);
});