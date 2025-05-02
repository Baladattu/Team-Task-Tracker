const Project = require('../models/Project.model');
const getAllProjects = async (req, res) => {
    const projects = await Project.findAll({ where: { owner_id: req.user.id } });
    res.json(projects);
};
const createProject = async (req, res) => {
    const { name, description } = req.body;
    const project = await Project.create({ name, description, owner_id: req.user.id });
    res.status(201).json(project);
};
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ error: 'Not found' });
        res.json(project);
    } catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error', err});
    }
};
const updateProject = async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    await project.update(req.body);
    res.json(project);
};
const deleteProject = async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    await project.destroy();
    res.json({ message: 'Deleted' });
};

module.exports = { getAllProjects, createProject, getProjectById, updateProject, deleteProject };
