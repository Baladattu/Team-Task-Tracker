const express = require('express');
const commentRouter = express.Router();
const ensureAuth = require('../middlewares/auth.middleware');
const { addComment, getCommentsByTask, deleteComment } = require('../controllers/comments.controller');

commentRouter.post('/', ensureAuth, addComment);
commentRouter.get('/:taskId', ensureAuth, getCommentsByTask);
commentRouter.delete('/:id', ensureAuth, deleteComment);

module.exports = commentRouter;

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Endpoints to manage task comments
 */

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Add a new comment to a task
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewComment'
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /comment/{taskId}:
 *   get:
 *     summary: Get all comments for a specific task
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the task
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the comment
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 */
