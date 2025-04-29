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

const certPath = '/usr/src/app/certs/backend';
if (!fs.existsSync(`${certPath}/backend-cert.pem`) || 
    !fs.existsSync(`${certPath}/backend-key.pem`)) {
  console.error('Certificats SSL manquants ou inaccessibles.');
  process.exit(1);
}

const privateKey = fs.readFileSync(`${certPath}/backend-key.pem`, 'utf8');
const certificate = fs.readFileSync(`${certPath}/backend-cert.pem`, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'votre_secret_session_ici',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  })
);
app.use(cors({
  origin: ['http://localhost', 'http://localhost:5173', 'https://localhost:5173', 'https://localhost'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));

// Middleware CSRF uniquement pour /tasks (désactivé temporairement)
const csrfProtection = csrf({ cookie: { httpOnly: true, secure: false } });
app.use('/tasks', taskRoutes); // Corriger ici : ajouter taskRoutes

app.get('/csrf-token', (req, res) => {
  console.log('Requête /csrf-token reçue, envoi du jeton:', req.csrfToken ? req.csrfToken() : 'disabled');
  res.json({ csrfToken: req.csrfToken ? req.csrfToken() : 'disabled' });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.use((req, res, next) => {
  console.log('Middleware global, headers:', req.headers);
  console.log('Requête reçue:', req.method, req.url);
  const oldWrite = res.write;
  res.write = function (data) {
    console.log('Écriture dans**MOT DE PASSE** res:', data.toString());
    return oldWrite.apply(res, arguments);
  };
  const oldJson = res.json;
  res.json = function (data) {
    console.log('Réponse JSON:', JSON.stringify(data));
    return oldJson.apply(res, arguments);
  };
  next();
});

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

app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ error: 'Une erreur est survenue.' });
});

https.createServer(credentials, app).listen(PORT, () => {
  console.log(`✅ Serveur démarré sur https://localhost:${PORT}`);
});