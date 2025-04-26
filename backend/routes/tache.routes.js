import express from 'express';
import {
  creerTache,
  listerTaches,
  lireTache,
  modifierTache,
  supprimerTache
} from '../controllers/tache.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 🔐 Toutes les routes sont protégées par le middleware JWT
router.post('/', verifyToken, creerTache);             // Créer une tâche
router.get('/', verifyToken, listerTaches);            // Obtenir toutes les tâches de l'utilisateur
router.get('/:id', verifyToken, lireTache);            // Obtenir une tâche par ID
router.put('/:id', verifyToken, modifierTache);        // Modifier une tâche
router.delete('/:id', verifyToken, supprimerTache);    // Supprimer une tâche

export default router;
