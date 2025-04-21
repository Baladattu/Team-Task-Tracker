const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  provider: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  provider_id: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'Users',
  timestamps: true,
});

module.exports = User;
