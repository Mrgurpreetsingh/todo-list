import pool from '../config/db.js';

export const createUser = async (username, email, mot_de_passe, nom, prenom) => {
  try {
    console.log('Création utilisateur:', { username, email, mot_de_passe, nom, prenom });
    const [result] = await pool.promise().query(
      `INSERT INTO users (username, email, mot_de_passe, nom, prenom) VALUES (?, ?, ?, ?, ?)`,
      [username, email, mot_de_passe, nom, prenom]
    );
    console.log('Résultat de l\'insertion:', result);
    return result;
  } catch (err) {
    console.error('Erreur dans createUser:', err);
    throw new Error('Erreur lors de la création de l\'utilisateur');
  }
};

export const getUserByEmail = async (email) => {
  try {
    console.log('Recherche utilisateur avec email:', email);
    const [rows] = await pool.promise().query(`SELECT * FROM users WHERE email = ?`, [email]);
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
    const [rows] = await pool.promise().query(`SELECT * FROM users WHERE id = ?`, [id]);
    console.log('Résultat de la requête:', rows);
    return rows[0];
  } catch (err) {
    console.error('Erreur dans getUserById:', err);
    throw new Error('Erreur lors de la récupération de l\'utilisateur');
  }
};