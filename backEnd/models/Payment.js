const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Package = require('./Package');

const Payment = sequelize.define('Payment', {
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
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Package,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  coinsPurchased: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  razorpayOrderId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  razorpayPaymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('created', 'completed', 'failed'),
    defaultValue: 'created'
  }
});

// Relationships
User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

Package.hasMany(Payment, { foreignKey: 'packageId' });
Payment.belongsTo(Package, { foreignKey: 'packageId' });

module.exports = Payment;