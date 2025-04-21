const User = require('../models/User.model');
const getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.json(users);
};
const getUserById = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
};

module.exports = { getAllUsers, getUserById };