import { getUserByEmail, createUser, getUserById } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { username, email, mot_de_passe, nom, prenom } = req.body;

  try {
    console.log('Tentative d\'inscription:', { username, email, nom, prenom });
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'L\'email est déjà utilisé' });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);
    const result = await createUser(username, email, hash, nom, prenom);

    const newUser = await getUserByEmail(email);
    if (!newUser) {
      return res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur nouvellement créé' });
    }

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        nom: newUser.nom,
        prenom: newUser.prenom,
      },
    });
  } catch (err) {
    console.error('Erreur dans register:', err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    console.log('Tentative de connexion:', { email });
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) {
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
    console.error('Erreur dans login:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Aucun token fourni' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decoded.userId);

    if (!user) {
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
    console.error('Erreur dans getMe:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
};