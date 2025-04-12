// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// router.get('/user', (req, res) => {
//   res.status(200).json({ message: 'User route is working!' });
// });
// router.get('/me', (req, res) => {
//     console.log("req",req);
//   res.status(200).json({ message: 'User route is working!' });
// });

// router.get('/earnings', (req, res) => {
//     console.log("req",req);
//   res.status(200).json({ message: 'User route is working!' });
// });
// router.get('/stats', (req, res) => {
//     console.log("req",req);
//   res.status(200).json({ message: 'User route is working!' });
// });
// module.exports = router;

// routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const CoinGeneration = require('../models/CoinGeneration');
const { Op } = require('sequelize');

// Test route
router.get('/user', (req, res) => {
  res.status(200).json({ message: 'User route is working!' });
});

// Get current user info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'currentCoins', 'totalEarnings']
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

// Earnings endpoint (future scope)
router.get('/earnings', auth, async (req, res) => {
  console.log("req.user", req.user);
  res.status(200).json({ message: 'Earnings route is working!' });
});

// Stats route: currentCoins, todayEarnings, totalEarnings
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

    const todayEarnings = await CoinGeneration.sum('rupeesEarned', {
      where: {
        userId: req.user.id,
        date: today
      }
    });

    res.status(200).json({
      currentCoins: user.currentCoins,
      todayEarnings: parseFloat(todayEarnings || 0),
      totalEarnings: parseFloat(user.totalEarnings || 0)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user stats' });
  }
});

module.exports = router;