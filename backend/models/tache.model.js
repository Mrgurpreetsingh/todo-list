// backend/models/tache.model.js
import pool from '../config/db.js';

export const createTache = async (titre, description, id_user, priorite_id = null) => {
  try {
    console.log('Création de la tâche:', { titre, description, id_user, priorite_id });
    if (priorite_id) {
      const [priorite] = await pool.query('SELECT id_priorite FROM priorite WHERE id_priorite = ?', [priorite_id]);
      if (priorite.length === 0) {
        console.error('Priorité invalide:', priorite_id);
        throw new Error(`Priorité invalide: ${priorite_id}`);
      }
    }
    const [result] = await pool.query(
      `INSERT INTO tache (titre, description, id_user, priorite_id, est_complete) VALUES (?, ?, ?, ?, ?)`,
      [titre, description || null, id_user, priorite_id, 0]
    );
    console.log('Tâche créée, ID:', result.insertId);
    return result;
  } catch (error) {
    console.error('Erreur SQL dans createTache:', error);
    throw new Error(`Erreur lors de la création de la tâche: ${error.message}`);
  }
};

export const getTachesByUserId = async (id_user) => {
  try {
    console.log('Récupération des tâches pour id_user:', id_user);
    const [rows] = await pool.query(
      `SELECT t.*, p.niveau AS priorite_niveau
       FROM tache t
       LEFT JOIN priorite p ON t.priorite_id = p.id_priorite
       WHERE t.id_user = ?`,
      [id_user]
    );
    console.log('Tâches récupérées:', rows);
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
    console.log('Tâche récupérée:', rows[0]);
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
    console.log('Toutes les tâches récupérées:', rows);
    return rows;
  } catch (error) {
    console.error('Erreur SQL dans getAllTaches:', error);
    throw new Error(`Erreur lors de la récupération des tâches: ${error.message}`);
  }
};

export const updateTache = async (id_tache, updates) => {
  try {
    console.log('Mise à jour de la tâche:', id_tache, updates);
    const tache = await getTacheById(id_tache);
    if (!tache) {
      throw new Error('Tâche non trouvée');
    }
    const { titre = tache.titre, description = tache.description, est_complete = tache.est_complete, priorite_id = tache.priorite_id } = updates;
    if (priorite_id) {
      const [priorite] = await pool.query('SELECT id_priorite FROM priorite WHERE id_priorite = ?', [priorite_id]);
      if (priorite.length === 0) {
        console.error('Priorité invalide:', priorite_id);
        throw new Error(`Priorité invalide: ${priorite_id}`);
      }
    }
    const [result] = await pool.query(
      `UPDATE tache SET titre = ?, description = ?, est_complete = ?, priorite_id = ? WHERE id_tache = ?`,
      [titre, description || null, est_complete, priorite_id, id_tache]
    );
    console.log('Tâche mise à jour:', result);
    return result;
  } catch (error) {
    console.error('Erreur SQL dans updateTache:', error);
    throw new Error(`Erreur lors de la mise à jour de la tâche: ${error.message}`);
  }
};

export const deleteTache = async (id_tache) => {
  try {
    console.log('Suppression de la tâche:', id_tache);
    const [result] = await pool.query(
      `DELETE FROM tache WHERE id_tache = ?`,
      [id_tache]
    );
    console.log('Tâche supprimée:', result);
    return result;
  } catch (error) {
    console.error('Erreur SQL dans deleteTache:', error);
    throw new Error(`Erreur lors de la suppression de la tâche: ${error.message}`);
  }
};