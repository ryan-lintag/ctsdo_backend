import jwt from 'jsonwebtoken';
import User from '../model/user.js';

export const checkAuth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json('No Token found');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json('Invalid Token');
    }
    req.userId = decoded.id;  // ✅ always lowercase
    next();
  });
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token || req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;                     // ✅ FIXED
    req.user = await User.findById(decoded.id);  // ✅ FIXED
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
};
