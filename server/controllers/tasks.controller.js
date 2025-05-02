const Task = require('../models/Task.model');

const getAllTasks = async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
};
const createTask = async (req, res) => {
    try {
        const { status, title, description, due_date, project_id, assigned_to } = req.body;
        const task = await Task.create({
            status,
            title,
            description,
            due_date,
            project_id,
            assigned_to,
        });
        console.log(task);
        res.status(201).json(task);
    } catch (err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error', err });
    }
};
const getTaskById = async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json(task);
};
const getTaskByProjectId = async (req, res) => {
    const tasks = await Task.findAll({ where: { project_id: req.params.id } });
    if (!tasks) return res.status(404).json({ error: 'Not found' });
    res.json(tasks);
};
const updateTask = async (req, res) => {
    try {
        const { status, title, description, due_date } = req.body;
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Not found' });
        await task.update({ status, title, description, due_date });
        await task.save();
        res.json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error', err });
    }
};
const deleteTask = async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    await task.destroy();
    res.json({ message: 'Deleted' });
};

module.exports = { getAllTasks, createTask, getTaskById, updateTask, deleteTask, getTaskByProjectId };
