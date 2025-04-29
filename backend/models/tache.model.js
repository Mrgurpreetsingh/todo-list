// backend/models/tache.model.js
import pool from '../config/db.js';

export const createTache = async (titre, description, id_user, priorite_id = null) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO tache (titre, description, id_user, priorite_id, est_complete) VALUES (?, ?, ?, ?, ?)`,
      [titre, description || null, id_user, priorite_id, 0]
    );
    return result;
  } catch (error) {
    console.error('Erreur SQL dans createTache:', error);
    throw new Error(`Erreur lors de la création de la tâche: ${error.message}`);
  }
};

export const getTachesByUserId = async (id_user) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, p.niveau AS priorite_niveau
       FROM tache t
       LEFT JOIN priorite p ON t.priorite_id = p.id_priorite
       WHERE t.id_user = ?`,
      [id_user]
    );
    console.log('Résultat de la requête SQL pour id_user', id_user, ':', rows);
    return rows;
  } catch (error) {
    console.error('Erreur SQL dans getTachesByUserId:', error);
    throw new Error(`Erreur lors de la récupération des tâches: ${error.message}`);
  }
};

export const getTacheById = async (id_tache) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, p.niveau AS priorite_niveau
       FROM tache t
       LEFT JOIN priorite p ON t.priorite_id = p.id_priorite
       WHERE t.id_tache = ?`,
      [id_tache]
    );
    return rows[0];
  } catch (error) {
    console.error('Erreur SQL dans getTacheById:', error);
    throw new Error(`Erreur lors de la récupération de la tâche: ${error.message}`);
  }
};

export const getAllTaches = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, p.niveau AS priorite_niveau
       FROM tache t
       LEFT JOIN priorite p ON t.priorite_id = p.id_priorite`
    );
    return rows;
  } catch (error) {
    console.error('Erreur SQL dans getAllTaches:', error);
    throw new Error(`Erreur lors de la récupération des tâches: ${error.message}`);
  }
};

export const updateTache = async (id_tache, updates) => {
  try {
    const tache = await getTacheById(id_tache);
    if (!tache) {
      throw new Error('Tâche non trouvée');
    }
    const { titre = tache.titre, description = tache.description, est_complete = tache.est_complete, priorite_id = tache.priorite_id } = updates;
    const [result] = await pool.query(
      `UPDATE tache SET titre = ?, description = ?, est_complete = ?, priorite_id = ? WHERE id_tache = ?`,
      [titre, description || null, est_complete, priorite_id, id_tache]
    );
    return result;
  } catch (error) {
    console.error('Erreur SQL dans updateTache:', error);
    throw new Error(`Erreur lors de la mise à jour de la tâche: ${error.message}`);
  }
};

export const deleteTache = async (id_tache) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM tache WHERE id_tache = ?`,
      [id_tache]
    );
    return result;
  } catch (error) {
    console.error('Erreur SQL dans deleteTache:', error);
    throw new Error(`Erreur lors de la suppression de la tâche: ${error.message}`);
  }
};