// backend/controllers/user.controller.js
import { getUserById, getAllUsers, updateUser, deleteUser, createUser } from '../models/user.model.js';

export const createUserController = async (req, res) => {
  try {
    const { username, email, mot_de_passe, nom, prenom } = req.body;
    console.log('📡 createUserController appelé:', { username, email, nom, prenom });
    if (!username || !email || !mot_de_passe) {
      return res.status(400).json({ error: 'Username, email et mot de passe sont requis' });
    }
    const { id } = await createUser(username, email, mot_de_passe, nom, prenom);
    const newUser = await getUserById(id);
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Erreur dans createUserController:', err);
    res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
};

export const getUserController = async (req, res) => {
  try {
    console.log('📡 getUserController appelé avec id:', req.params.id);
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Erreur dans getUserController:', err);
    res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    console.log('📡 getAllUsersController appelé');
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error('Erreur dans getAllUsersController:', err);
    res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
};

export const updateUserController = async (req, res) => {
  try {
    console.log('📡 updateUserController appelé avec userId:', req.params.id || req.userId, 'updates:', req.body);
    const updates = req.body;
    const userId = req.params.id || req.userId;
    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }
    await updateUser(userId, updates);
    const updatedUser = await getUserById(userId);
    res.status(200).json({ message: 'Utilisateur mis à jour', user: updatedUser });
  } catch (err) {
    console.error('Erreur dans updateUserController:', err);
    res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    console.log('📡 deleteUserController appelé avec userId:', req.params.id || req.userId);
    const userId = req.params.id || req.userId;
    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }
    await deleteUser(userId);
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error('Erreur dans deleteUserController:', err);
    res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
};