import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import axios from 'axios';

export const register = async (req, res, next) => {
  try {
    const { username, email, mot_de_passe, nom, prenom, recaptchaToken } = req.body;
    console.log('Tentative d\'inscription:', { username, email, nom, prenom, recaptchaToken });

    if (!username || !email || !mot_de_passe || !nom || !prenom || !recaptchaToken) {
      console.log('Données manquantes:', { username, email, mot_de_passe, nom, prenom, recaptchaToken });
      return res.status(400).json({ error: 'Tous les champs et reCAPTCHA sont requis' });
    }

    // Vérifier le jeton reCAPTCHA
    const recaptchaResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!recaptchaResponse.data.success) {
      console.log('Échec reCAPTCHA:', recaptchaResponse.data);
      return res.status(400).json({ error: 'Échec de la vérification reCAPTCHA' });
    }

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
    console.log('Token créé:', token); 

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
    const { email, password, recaptchaToken } = req.body;
    console.log('Tentative de connexion:', { email });

    if (!email || !password || !recaptchaToken) {
      console.log('Données manquantes:', { email, password, recaptchaToken });
      return res.status(400).json({ error: 'Email, mot de passe et reCAPTCHA sont requis' });
    }

    // Vérifier le jeton reCAPTCHA
    const recaptchaResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ error: 'Échec de la vérification reCAPTCHA' });
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

    const token = jwt.sign({ userId: user.id_user }, process.env.JWT_SECRET || 'votre_secret_jwt', {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        id: user.id_user,
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
    const id_user = req.userId;
    console.log('getMe appelé avec id_user:', id_user);

    const [users] = await pool.query(
      'SELECT id_user, username, email, nom, prenom, role FROM users WHERE id_user = ?',
      [id_user]
    );
    console.log('Recherche utilisateur avec id:', id_user, 'Résultat:', users);
    const user = users[0];
    if (!user) {
      console.log('Utilisateur non trouvé');
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    console.log('Réponse getMe:', user);
    res.json(user);
  } catch (err) {
    console.error('Erreur getMe:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token'); // ou le nom de ton cookie JWT
  req.session?.destroy(() => {
    res.status(200).json({ message: 'Déconnecté avec succès' });
  });
};