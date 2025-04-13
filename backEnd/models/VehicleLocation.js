const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VehicleLocation = sequelize.define('VehicleLocation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  vehicleId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'vehicle_locations',
  timestamps: false, // You can enable timestamps if you want Sequelize to manage `createdAt` and `updatedAt`
});

module.exports = VehicleLocation;
