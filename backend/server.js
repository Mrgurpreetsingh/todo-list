import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import rateLimiter from './middlewares/rateLimit.middleware.js';
import authRoutes from './routes/auth.routes.js';
import tacheRoutes from './routes/tache.routes.js';
import csrfProtection from './middlewares/csrf.middleware.js';

dotenv.config();

const app= express();
const PORT= process.env.PORT || 3000;

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(csrfProtection); // optionnel ici si activé par route

// Routes
app.use('/auth', authRoutes);
app.use('/taches', tacheRoutes);

// Serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
