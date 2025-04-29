import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('📥 En-tête Authorization:', authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  console.log('🔍 verifyToken appelé, token:', token);

  if (!token) {
    console.log('❌ Token manquant');
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token décodé:', decoded);
    if (!decoded.userId) {
      console.log('❌ userId non trouvé dans le token décodé');
      return res.status(403).json({ message: 'Token invalide, userId manquant' });
    }
    req.userId = decoded.userId;
    console.log('👤 req.userId défini:', req.userId);
    next();
  } catch (err) {
    console.error('❌ Erreur dans verifyToken:', err.name, err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expiré' });
    }
    return res.status(403).json({ message: 'Token invalide', error: err.message });
  }
};