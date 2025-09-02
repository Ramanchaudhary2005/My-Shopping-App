const jwt = require('jsonwebtoken');
const { UserModel } = require('../../../models/userSchema');
const config = require('../../../config/env');

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        isSuccess: false,
        message: 'Access token required',
        data: {}
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Find user and attach to request
    const user = await UserModel.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        isSuccess: false,
        message: 'Invalid token - user not found',
        data: {}
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        isSuccess: false,
        message: 'Invalid token',
        data: {}
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        isSuccess: false,
        message: 'Token expired',
        data: {}
      });
    }

    console.error('JWT Middleware Error:', error);
    return res.status(500).json({
      isSuccess: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Optional authentication - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = await UserModel.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

module.exports = { authenticateToken, optionalAuth };
