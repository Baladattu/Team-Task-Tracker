const Task = require('../models/Task.model');

const getAllTasks = async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
};
const createTask = async (req, res) => {
    const task = await Task.create(req.body);
    res.status(201).json(task);
};
const getTaskById = async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json(task);
};
const updateTask = async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    await task.update(req.body);
    res.json(task);
};
const deleteTask = async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    await task.destroy();
    res.json({ message: 'Deleted' });
};

module.exports = { getAllTasks, createTask, getTaskById, updateTask, deleteTask };
