const Comment = require('../models/Comment.model');
const addComment = async (req, res) => {
    const comment = await Comment.create({
        ...req.body,
        author_id: req.user.id,
    });
    res.status(201).json(comment);
};
const getCommentsByTask = async (req, res) => {
    const comments = await Comment.findAll({ where: { task_id: req.params.taskId } });
    res.json(comments);
};
const deleteComment = async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Not found' });
    await comment.destroy();
    res.json({ message: 'Deleted' });
};

module.exports = { addComment, getCommentsByTask, deleteComment };
