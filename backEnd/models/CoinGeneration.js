const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const CoinGeneration = sequelize.define('CoinGeneration', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  coinsGenerated: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  conversionRate: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false
  },
  rupeesEarned: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
});

// Relationship
User.hasMany(CoinGeneration, { foreignKey: 'userId' });
CoinGeneration.belongsTo(User, { foreignKey: 'userId' });

module.exports = CoinGeneration;