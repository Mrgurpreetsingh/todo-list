// backend/models/user.model.js
import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const createUser = async (username, email, mot_de_passe, nom, prenom) => {
  try {
    console.log('Création utilisateur:', { username, email, mot_de_passe, nom, prenom });
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const [result] = await pool.query(
      `INSERT INTO users (username, email, mot_de_passe, nom, prenom, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, nom, prenom, 'user']
    );
    console.log('Résultat de l\'insertion:', result);
    return { id: result.insertId };
  } catch (err) {
    console.error('Erreur dans createUser:', err);
    throw new Error('Erreur lors de la création de l\'utilisateur');
  }
};

export const getUserByEmail = async (email) => {
  try {
    console.log('Recherche utilisateur avec email:', email);
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    console.log('Résultat de la requête:', rows);
    return rows[0];
  } catch (err) {
    console.error('Erreur dans getUserByEmail:', err);
    throw new Error('Erreur lors de la récupération de l\'utilisateur');
  }
};

export const getUserById = async (id) => {
  try {
    console.log('Recherche utilisateur avec id:', id);
    const [rows] = await pool.query(
      `SELECT id, username, email, nom, prenom, role FROM users WHERE id = ?`,
      [id]
    );
    console.log('Résultat de la requête:', rows);
    return rows[0];
  } catch (err) {
    console.error('Erreur dans getUserById:', err);
    throw new Error('Erreur lors de la récupération de l\'utilisateur');
  }
};

export const getAllUsers = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT id, username, email, nom, prenom, role FROM users`
    );
    console.log('Utilisateurs récupérés:', rows);
    return rows;
  } catch (err) {
    console.error('Erreur dans getAllUsers:', err);
    throw new Error('Erreur lors de la récupération des utilisateurs');
  }
};

export const updateUser = async (id, updates) => {
  try {
    console.log('Mise à jour de l\'utilisateur:', id, updates);
    const { username, email, mot_de_passe, nom, prenom } = updates;
    let hashedPassword = null;
    if (mot_de_passe) {
      hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    }
    const [result] = await pool.query(
      `UPDATE users SET username = COALESCE(?, username), email = COALESCE(?, email), mot_de_passe = COALESCE(?, mot_de_passe), nom = COALESCE(?, nom), prenom = COALESCE(?, prenom) WHERE id = ?`,
      [username, email, hashedPassword, nom, prenom, id]
    );
    console.log('Utilisateur mis à jour:', result);
    if (result.affectedRows === 0) {
      throw new Error('Utilisateur non trouvé');
    }
    return result;
  } catch (err) {
    console.error('Erreur dans updateUser:', err);
    throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
  }
};

export const deleteUser = async (id) => {
  try {
    console.log('Suppression de l\'utilisateur:', id);
    const [result] = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
    console.log('Utilisateur supprimé:', result);
    if (result.affectedRows === 0) {
      throw new Error('Utilisateur non trouvé');
    }
    return result;
  } catch (err) {
    console.error('Erreur dans deleteUser:', err);
    throw new Error('Erreur lors de la suppression de l\'utilisateur');
  }
};