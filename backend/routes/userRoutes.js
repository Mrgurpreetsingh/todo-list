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

// Routes pour l'utilisateur connecté (placées en premier pour éviter les conflits)
router.get('/me', verifyToken, async (req, res) => {
  console.log('📡 GET /me appelé avec userId:', req.userId);
  try {
    const user = await getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Erreur dans GET /me:', err);
    res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
});

router.put('/me', verifyToken, async (req, res) => {
  console.log('📡 PUT /me appelé avec userId:', req.userId, 'updates:', req.body);
  try {
    const updates = req.body;
    await updateUser(req.userId, updates);
    const updatedUser = await getUserById(req.userId);
    res.status(200).json({ message: 'Utilisateur mis à jour', user: updatedUser });
  } catch (err) {
    console.error('Erreur dans PUT /me:', err);
    res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
});

router.delete('/me', verifyToken, async (req, res) => {
  console.log('📡 DELETE /me appelé avec userId:', req.userId);
  try {
    await deleteUser(req.userId);
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error('Erreur dans DELETE /me:', err);
    res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
});

// Routes demandées pour le projet
router.post('/', createUserController); // POST /users
router.get('/', verifyToken, requireAdmin, getAllUsersController); // GET /users
router.get('/user/:id', verifyToken, getUserController); // GET /user/{id}
router.put('/user/:id', verifyToken, updateUserController); // PUT /user/{id}
router.delete('/user/:id', verifyToken, deleteUserController); // DELETE /user/{id}

export default router;