const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User.model');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'Projects',
  timestamps: true,
});

Project.belongsTo(User, {
  foreignKey: 'owner_id',
  onDelete: 'CASCADE',
});

module.exports = Project;
