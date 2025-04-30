// backend/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { getUserById } from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
  console.log('📡 verifyToken appelé');
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('🔍 Token reçu:', token ? 'présent' : 'absent');
    if (!token) {
      return res.status(401).json({ error: 'Token requis' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token décodé:', decoded);
    const user = await getUserById(decoded.userId);
    if (!user) {
      console.log('❌ Utilisateur non trouvé pour userId:', decoded.userId);
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    req.userId = decoded.userId;
    req.userRole = user.role;
    console.log('👤 req.userId défini:', req.userId, 'role:', req.userRole);
    next();
  } catch (err) {
    console.error('Erreur dans verifyToken:', err);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

export const requireAdmin = (req, res, next) => {
  console.log('📡 requireAdmin appelé avec role:', req.userRole);
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
};