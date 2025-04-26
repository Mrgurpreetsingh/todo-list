import { createTache, getAllTaches, getTacheById, updateTache, deleteTache } from '../models/tache.model.js';

// 🔹 Créer une tâche
export const creerTache = async (req, res) => {
  const { titre, description } = req.body;
  const id_user = req.userId;  // Assurer que c'est bien id_user

  try {
    const result = await createTache(titre, description, id_user);  // Utilisation de id_user
    res.status(201).json({ message: 'Tâche créée avec succès', tacheId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la tâche', error });
  }
};

// 🔹 Obtenir toutes les tâches de l'utilisateur
export const listerTaches = async (req, res) => {
  const id_user = req.userId;  // Assurer que c'est bien id_user

  try {
    const taches = await getAllTaches(id_user);  // Utilisation de id_user
    res.status(200).json(taches);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error });
  }
};

// 🔹 Obtenir une tâche par ID
export const lireTache = async (req, res) => {
  const id = req.params.id;

  try {
    const tache = await getTacheById(id);
    if (!tache) return res.status(404).json({ message: 'Tâche non trouvée' });
    res.status(200).json(tache);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la tâche', error });
  }
};

// 🔹 Mettre à jour une tâche
export const modifierTache = async (req, res) => {
  const id = req.params.id;
  const { titre, description, est_complete } = req.body;

  try {
    await updateTache(id, titre, description, est_complete);
    res.status(200).json({ message: 'Tâche mise à jour' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error });
  }
};

// 🔹 Supprimer une tâche
export const supprimerTache = async (req, res) => {
  const id = req.params.id;

  try {
    await deleteTache(id);
    res.status(200).json({ message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error });
  }
};
