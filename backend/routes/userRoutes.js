// backend/routes/userRoutes.js
import express from 'express';
import {
  createUserController,
  getUserController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
} from '../controllers/user.controller.js';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Créer un utilisateur
router.post('/', async (req, res) => {
  console.log('📡 POST /api/users appelé avec:', req.body);
  try {
    const { username, email, mot_de_passe, nom, prenom } = req.body;
    if (!username || !email || !mot_de_passe) {
      return res.status(400).json({ error: 'Username, email et mot de passe sont requis' });
    }
    await createUserController(req, res);
  } catch (err) {
    console.error('Erreur dans POST /api/users:', err);
    res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
});

// Récupérer l'utilisateur connecté
router.get('/me', verifyToken, async (req, res) => {
  console.log('📡 GET /api/users/me appelé avec userId:', req.userId);
  try {
    req.params.id = req.userId; // Simuler l'ID pour getUserController
    await getUserController(req, res);
  } catch (err) {
    console.error('Erreur dans GET /api/users/me:', err);
    res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
});

// Mettre à jour l'utilisateur connecté
router.put('/me', verifyToken, async (req, res) => {
  console.log('📡 PUT /api/users/me appelé avec userId:', req.userId, 'updates:', req.body);
  try {
    req.params.id = req.userId; // Simuler l'ID pour updateUserController
    await updateUserController(req, res);
  } catch (err) {
    console.error('Erreur dans PUT /api/users/me:', err);
    res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
});

// Routes admin
router.get('/', verifyToken, requireAdmin, getAllUsersController);
router.get('/user/:id', verifyToken, getUserController);
router.put('/user/:id', verifyToken, updateUserController);
router.delete('/user/:id', verifyToken, deleteUserController);

export default router;