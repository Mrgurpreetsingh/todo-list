// backend/controllers/auth.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, mot_de_passe, nom, prenom } = req.body;
    console.log('Tentative d\'inscription:', { username, email, nom, prenom });

    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('Recherche utilisateur avec email:', email, 'Résultat:', existingUsers);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, mot_de_passe, nom, prenom, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, nom, prenom, 'user']
    );
    console.log('Utilisateur créé:', { id: result.insertId });

    const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET || 'votre_secret_jwt', {
      expiresIn: '1h',
    });

    res.status(201).json({
      token,
      user: { id: result.insertId, username, email, nom, prenom, role: 'user' },
    });
  } catch (err) {
    console.error('Erreur register:', err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Tentative de connexion:', { email, password }); // Log complet
    if (!email || !password) {
      console.log('Données manquantes:', { email, password });
      return res.status(400).json({ error: 'Email et mot de passe sont requis' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('Recherche utilisateur avec email:', email, 'Résultat:', users);
    const user = users[0];
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.mot_de_passe);
    console.log('Comparaison mot de passe:', { isMatch });
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'votre_secret_jwt', {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Erreur login:', err);
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Requête /auth/me reçue:', token);
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
    console.log('Token décodé:', decoded);

    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    console.log('Recherche utilisateur avec id:', decoded.userId, 'Résultat:', users);
    const user = users[0];
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Erreur getMe:', err);
    next(err);
  }
};