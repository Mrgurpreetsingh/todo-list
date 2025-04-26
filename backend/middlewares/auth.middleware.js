import jwt from 'jsonwebtoken';

// Middleware de vérification du token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // format: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // vérifie et décode
    req.userId = decoded.id; // on stocke l’id du user dans la requête
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token invalide ou expiré' });
  }
};
