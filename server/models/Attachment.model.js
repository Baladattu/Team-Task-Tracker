const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Task = require('./Task.model');
const User = require('./User.model');

const Attachment = sequelize.define('Attachment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  file_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  file_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'Attachments',
  timestamps: true,
});

Attachment.belongsTo(Task, { foreignKey: 'task_id', onDelete: 'CASCADE' });
Attachment.belongsTo(User, { foreignKey: 'uploaded_by' });

module.exports = Attachment;
