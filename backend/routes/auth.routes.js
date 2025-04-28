import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';

const router = express.Router();

// Route pour l'inscription
router.post('/register', register);

// Route pour la connexion
router.post('/login', login);

// Route pour récupérer l'utilisateur
router.get('/me', getMe);

export default router;