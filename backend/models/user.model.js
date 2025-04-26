import pool from '../config/db.js';

export const createUser= async(username,email,mot_de_passe,nom,prenom) =>{
    try{
        const[result] = await pool.promise().query(
            `INSERT INTO users (username, email, mot_de_passe, nom, prenom) VALUES (?, ?, ?, ?, ?)`,
      [username, email, mot_de_passe, nom, prenom]
    );
    return result;
        } catch (err) {
                throw new Error('Erreur lors de la création de l\'utilisateur');
                    }
                };
                export const getUserByEmail = async (email) => {
                    try {
                      const [rows] = await pool.promise().query(`SELECT * FROM users WHERE email = ?`, [email]);
                      return rows[0]; // Retourne l'utilisateur si trouvé, sinon null
                    } catch (err) {
                      throw new Error('Erreur lors de la récupération de l\'utilisateur');
                    }
                  };
                  
                  export const getUserById = async (id) => {
                    try {
                      const [rows] = await pool.promise().query(`SELECT * FROM users WHERE id = ?`, [id]);
                      return rows[0]; // Retourne l'utilisateur
                    } catch (err) {
                      throw new Error('Erreur lors de la récupération de l\'utilisateur');
                    }
                  };
                  