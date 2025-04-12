const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Get the token from the header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'name', 'email', 'currentCoins', 'totalEarnings']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// routes/user.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const CoinGeneration = require('../models/CoinGeneration');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get authenticated user data
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Get today's earnings
    const todayEarnings = await CoinGeneration.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('rupeesEarned')), 'total']
      ],
      where: {
        userId: req.user.id,
        date: today
      },
      raw: true
    });

    res.status(200).json({
      currentCoins: req.user.currentCoins,
      todayEarnings: parseFloat(todayEarnings?.total || 0),
      totalEarnings: parseFloat(req.user.totalEarnings),
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get earnings history
router.get('/earnings', authMiddleware, async (req, res) => {
  try {
    const history = await CoinGeneration.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
      limit: 30
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching earnings history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;