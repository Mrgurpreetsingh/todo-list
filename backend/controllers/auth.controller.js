// backend/controllers/auth.controller.js
import { getUserByEmail, createUser, getUserById } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { username, email, mot_de_passe, nom, prenom } = req.body;

  try {
    console.log('Tentative d\'inscription:', { username, email, nom, prenom });
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('Email déjà utilisé:', email);
      return res.status(400).json({ message: 'L\'email est déjà utilisé' });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);
    const result = await createUser(username, email, hash, nom, prenom);
    console.log('Utilisateur créé:', result);

    const user = {
      id: result.id,
      username,
      email,
      nom,
      prenom,
      role: 'user',
    };

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user,
    });
  } catch (err) {
    console.error('Erreur dans register:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    console.log('Tentative de connexion:', { email });
    const user = await getUserByEmail(email);
    if (!user) {
      console.log('Utilisateur non trouvé:', email);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) {
      console.log('Mot de passe incorrect pour:', email);
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
      },
    });
  } catch (err) {
    console.error('Erreur dans login:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    console.log('Requête /auth/me reçue:', req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('Token manquant');
      return res.status(401).json({ message: 'Aucun token fourni' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decoded);
    const user = await getUserById(decoded.userId);
    console.log('Résultat getUserById:', user);

    if (!user) {
      console.log('Utilisateur non trouvé:', decoded.userId);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
      },
    });
  } catch (err) {
    console.error('Erreur dans getMe:', err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
};