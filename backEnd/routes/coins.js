// routes/coins.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const CoinGeneration = require('../models/CoinGeneration');
const sequelize = require('../config/database');

// Update user's coins and convert to rupees at end of day
router.post('/update', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { coins, user} = req.body;
    // const userId = req.user.id;
    const userId = user.id;

    if (typeof coins !== 'number' || coins < 0) {
      return res.status(400).json({ message: 'Invalid coin value.' });
    }

    // Update user's current coins
    await User.update(
      { currentCoins: coins },
      {
        where: { id: userId },
        transaction
      }
    );

    // Check if it's the end of the day (you can set specific criteria)
    const currentHour = new Date().getHours();
    const isEndOfDay = currentHour >= 23; // For example, if it's 11 PM or later

    if (isEndOfDay) {
      // Convert coins to rupees
      const conversionRate = 0.1; // Example: 1 coin = 0.1 rupees
      const rupeesEarned = coins * conversionRate;

      // Create coin generation record
      await CoinGeneration.create({
        userId,
        coinsGenerated: coins,
        conversionRate: conversionRate,
        rupeesEarned: rupeesEarned,
        date: new Date()
      }, { transaction });

      // Update user's total earnings
      await User.increment(
        { totalEarnings: rupeesEarned },
        {
          where: { id: userId },
          transaction
        }
      );

      // Reset user's current coins
      await User.update(
        { currentCoins: 0 },
        {
          where: { id: userId },
          transaction
        }
      );

      await transaction.commit();

      return res.status(200).json({
        message: 'Coins converted to rupees successfully',
        rupeesEarned,
        currentCoins: 0
      });
    }

    await transaction.commit();

    res.status(200).json({
      message: 'Coins updated successfully',
      currentCoins: coins
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating coins:', error);
    res.status(500).json({ message: 'Server error while updating coins' });
  }
});

module.exports = router;
