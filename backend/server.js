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
const PORT = 3000;

// Vérification de l'existence des certificats SSL
if (!fs.existsSync('C:/Users/PRFE12/OneDrive - ASSOFAC/Bureau/todo-list/certs/backend/backend-cert.pem') || 
    !fs.existsSync('C:/Users/PRFE12/OneDrive - ASSOFAC/Bureau/todo-list/certs/backend/backend-key.pem')) {
  console.error('Certificats SSL manquants ou inaccessibles.');
  process.exit(1); // Arrêt du serveur si les certificats sont introuvables
}

// Chargement des certificats générés pour le backend
const privateKey = fs.readFileSync('C:/Users/PRFE12/OneDrive - ASSOFAC/Bureau/todo-list/certs/backend/backend-key.pem', 'utf8');
const certificate = fs.readFileSync('C:/Users/PRFE12/OneDrive - ASSOFAC/Bureau/todo-list/certs/backend/backend-cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Déterminer l'environnement pour la gestion des cookies
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'votre_secret_session_ici',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: isProduction } // Ne mettre secure à true que si en production
  })
);
app.use(cors({ origin: 'https://localhost:5173', credentials: true }));

// Middleware CSRF
const csrfProtection = csrf({ cookie: { httpOnly: true, secure: isProduction } });
app.use(csrfProtection);

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Route pour obtenir le jeton CSRF
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Middleware d'erreur CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ error: 'Invalid CSRF token' });
  } else {
    next(err);
  }
});

// Middleware de gestion des erreurs générales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Une erreur est survenue.');
});

// Démarrage du serveur HTTPS avec les certificats
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`✅ Serveur démarré sur https://localhost:${PORT}`);
});
