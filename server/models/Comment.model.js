const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User.model');
const Task = require('./Task.model');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'Comments',
  timestamps: true,
});

Comment.belongsTo(Task, { foreignKey: 'task_id', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'author_id' });

module.exports = Comment;
