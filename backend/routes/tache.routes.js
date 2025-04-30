// backend/routes/tacheRoutes.js
import express from 'express';
import {
  creerTache,
  listerTaches,
  lireTache,
  modifierTache,
  supprimerTache,
} from '../controllers/tache.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Toutes les routes sont protégées par le middleware JWT
router.post('/', verifyToken, creerTache); // POST /tasks 
router.get('/', verifyToken, listerTaches); // GET /tasks
router.get('/:id', verifyToken, lireTache); // GET /tasks/:id
router.put('/:id', verifyToken, modifierTache); // PUT /tasks/:id
router.delete('/:id', verifyToken, supprimerTache); // DELETE /tasks/:id

export default router;