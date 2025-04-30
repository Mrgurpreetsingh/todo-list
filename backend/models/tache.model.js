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
      `INSERT INTO tache (titre, description, id_user, priorite_id, est_complete, date_creation) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [titre, description || null, id_user, priorite_id, 0]
    );
    console.log('Tâche créée, ID:', result.insertId);
    return { id_tache: result.insertId };
  } catch (error) {
    console.error('Erreur SQL dans createTache:', error);
    throw new Error(`Erreur lors de la création de la tâche: ${error.message}`);
  }
};

export const getTachesByUserId = async (id_user) => {
  try {
    console.log('Récupération des tâches pour id_user:', id_user);
    const [rows] = await pool.query(
      `SELECT t.id_tache, t.titre, t.description, t.date_creation, t.est_complete, 
              t.id_user, t.priorite_id, p.niveau AS priorite_niveau
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

export const getTacheById = async (id_tache, id_user) => {
  try {
    console.log('Récupération tâche avec id_tache:', id_tache, 'pour id_user:', id_user);
    const [rows] = await pool.query(
      `SELECT t.id_tache, t.titre, t.description, t.date_creation, t.est_complete, 
              t.id_user, t.priorite_id, p.niveau AS priorite_niveau
       FROM tache t
       LEFT JOIN priorite p ON t.priorite_id = p.id_priorite
       WHERE t.id_tache = ? AND t.id_user = ?`,
      [id_tache, id_user]
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
    console.log('Récupération de toutes les tâches');
    const [rows] = await pool.query(
      `SELECT t.id_tache, t.titre, t.description, t.date_creation, t.est_complete, 
              t.id_user, t.priorite_id, p.niveau AS priorite_niveau
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

export const updateTache = async (id_tache, id_user, updates) => {
  try {
    console.log('Mise à jour de la tâche:', id_tache, 'pour id_user:', id_user, 'updates:', updates);
    const tache = await getTacheById(id_tache, id_user);
    if (!tache) {
      throw new Error('Tâche non trouvée ou non autorisée');
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
      `UPDATE tache 
       SET titre = ?, description = ?, est_complete = ?, priorite_id = ? 
       WHERE id_tache = ? AND id_user = ?`,
      [titre, description || null, est_complete, priorite_id, id_tache, id_user]
    );
    console.log('Tâche mise à jour:', result);
    if (result.affectedRows === 0) {
      throw new Error('Tâche non trouvée ou non autorisée');
    }
    return result;
  } catch (error) {
    console.error('Erreur SQL dans updateTache:', error);
    throw new Error(`Erreur lors de la mise à jour de la tâche: ${error.message}`);
  }
};

export const deleteTache = async (id_tache, id_user) => {
  try {
    console.log('Suppression de la tâche:', id_tache, 'pour id_user:', id_user);
    const tache = await getTacheById(id_tache, id_user);
    if (!tache) {
      throw new Error('Tâche non trouvée ou non autorisée');
    }
    const [result] = await pool.query(
      `DELETE FROM tache WHERE id_tache = ? AND id_user = ?`,
      [id_tache, id_user]
    );
    console.log('Tâche supprimée:', result);
    if (result.affectedRows === 0) {
      throw new Error('Tâche non trouvée ou non autorisée');
    }
    return result;
  } catch (error) {
    console.error('Erreur SQL dans deleteTache:', error);
    throw new Error(`Erreur lors de la suppression de la tâche: ${error.message}`);
  }
};