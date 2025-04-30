// backend/controllers/tache.controller.js
import { createTache, getTachesByUserId, getTacheById, updateTache, deleteTache } from '../models/tache.model.js';

export const creerTache = async (req, res) => {
  const { titre, description, priorite_id } = req.body;
  const id_user = req.userId;
  console.log('📡 creerTache appelé avec userId:', id_user, 'body:', req.body);
  try {
    if (!id_user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    if (!titre) {
      return res.status(400).json({ message: 'Le titre est requis' });
    }
    const { id_tache } = await createTache(titre, description, id_user, priorite_id);
    const newTache = await getTacheById(id_tache, id_user);
    res.status(201).json(newTache);
  } catch (error) {
    console.error('Erreur dans creerTache:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la tâche', error: error.message });
  }
};

export const listerTaches = async (req, res) => {
  const id_user = req.userId;
  console.log('📡 listerTaches appelé avec id_user:', id_user);
  try {
    if (!id_user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    const taches = await getTachesByUserId(id_user);
    res.status(200).json(taches);
  } catch (error) {
    console.error('Erreur dans listerTaches:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des tâches', details: error.message });
  }
};

export const lireTache = async (req, res) => {
  const id_tache = req.params.id;
  const id_user = req.userId;
  console.log('📡 lireTache appelé avec id_tache:', id_tache, 'userId:', id_user);
  try {
    if (!id_user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    const tache = await getTacheById(id_tache, id_user);
    if (!tache) {
      return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
    }
    res.status(200).json(tache);
  } catch (error) {
    console.error('Erreur dans lireTache:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la tâche', details: error.message });
  }
};

export const modifierTache = async (req, res) => {
  const id_tache = req.params.id;
  const updates = req.body;
  const id_user = req.userId;
  console.log('📡 modifierTache appelé avec id_tache:', id_tache, 'userId:', id_user, 'updates:', updates);
  try {
    if (!id_user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    await updateTache(id_tache, id_user, updates);
    const updatedTache = await getTacheById(id_tache, id_user);
    res.status(200).json({ message: 'Tâche mise à jour', tache: updatedTache });
  } catch (error) {
    console.error('Erreur dans modifierTache:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche', error: error.message });
  }
};

export const supprimerTache = async (req, res) => {
  const id_tache = req.params.id;
  const id_user = req.userId;
  console.log('📡 supprimerTache appelé avec id_tache:', id_tache, 'userId:', id_user);
  try {
    if (!id_user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    await deleteTache(id_tache, id_user);
    res.status(200).json({ message: 'Tâche supprimée' });
  } catch (error) {
    console.error('Erreur dans supprimerTache:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la tâche', error: error.message });
  }
};