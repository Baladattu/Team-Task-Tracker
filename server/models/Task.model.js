const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User.model');
const Project = require('./Project.model');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('todo', 'in-progress', 'done'),
    defaultValue: 'todo',
  },
  deadline: {
    type: DataTypes.DATE,
  }
}, {
  tableName: 'Tasks',
  timestamps: true,
});

Task.belongsTo(Project, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'assigned_to', onDelete: 'CASCADE' });
Task.belongsTo(Task, { as: 'ParentTask', foreignKey: 'parent_task_id', onDelete: 'CASCADE' });
Task.hasMany(Task, { as: 'SubTasks', foreignKey: 'parent_task_id', onDelete: 'CASCADE' });

module.exports = Task;
