import pool from '../config/db.js';

export const createTache = async (titre, description, id_user) => { 
    try {
        const [result] = await pool.promise().query(
          `INSERT INTO tache (titre, description, id_user) VALUES (?, ?, ?)`,
          [titre, description, id_user]
        );
        return result;
      } catch (err) {
        throw new Error('Erreur lors de la création de la tâche');
      }
};

export const getTachesByUserId = async (id_user) => {
    try {
        const [rows] = await pool.promise().query(
            `SELECT * FROM tache WHERE id_user = ?`, [id_user]
        );
        return rows;
    } catch (err) {
        throw new Error('Erreur lors de la récupération des tâches');
    }
};

export const getTacheById = async (id_tache) => {
    try {
        const [rows] = await pool.promise().query(
            `SELECT * FROM tache WHERE id_tache = ?`, [id_tache]
        );
        return rows[0];
    } catch (err) {
        throw new Error('Erreur lors de la récupération de la tâche');
    }
};
export const getAllTaches = async () => {
    try {
      const [rows] = await pool.promise().query('SELECT * FROM tache');
      return rows;
    } catch (err) {
      throw new Error('Erreur lors de la récupération des tâches');
    }
  };
  

export const updateTache = async (id_tache, titre, description, est_complete) => {
    try {
        const [result] = await pool.promise().query(
            `UPDATE tache SET titre = ?, description = ?, est_complete = ? WHERE id_tache = ?`,
            [titre, description, est_complete, id_tache]
        );
        return result;
    } catch (err) {
        throw new Error("Erreur lors de la mise à jour de la tâche");
    }
};

export const deleteTache = async (id_tache) => {
    try {
        const [result] = await pool.promise().query(
            `DELETE FROM tache WHERE id_tache = ?`,
            [id_tache]
        );
        return result;
    } catch (err) {
        throw new Error("Erreur lors de la suppression de la tâche");
    }
};

      
