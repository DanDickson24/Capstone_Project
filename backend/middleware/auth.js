const bcrypt = require('bcrypt');
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username); 

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const match = await bcrypt.compare(password, user.hashed_password);
    if (match) {
      req.user = user; 
      next();
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    next(error);
  }
};

const checkRole = (role) => (req, res, next) => {
  if (req.user && req.user.user_type === role) {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log("Token received in verifyToken:", token);
  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = { authenticate, checkRole, verifyToken };
