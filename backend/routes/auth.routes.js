import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();

// Route pour l'inscription
router.post('/register', register);

// Route pour la connexion
router.post('/login', login);

export default router;
