const express = require('express');
const attachmentRouter = express.Router();
const { uploadAttachment, getAttachmentsByTask, getDownloadUrl, deleteAttachment } = require('../controllers/attachments.controller');
const ensureAuth = require('../middlewares/auth.middleware');
const multer = require('multer');
const upload = multer();

attachmentRouter.post('/', ensureAuth, upload.single('file'), uploadAttachment);
attachmentRouter.get('/:taskId', ensureAuth, getAttachmentsByTask);
attachmentRouter.get('/download/:key', ensureAuth, getDownloadUrl);
attachmentRouter.delete('/:id', ensureAuth, deleteAttachment);

module.exports = attachmentRouter;

/**
 * @swagger
 * tags:
 *   name: Attachments
 *   description: Endpoints to manage task file attachments
 */

/**
 * @swagger
 * /attachment:
 *   post:
 *     summary: Upload a new attachment to a task
 *     tags: [Attachments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               task_id:
 *                 type: string
 *                 format: uuid
 *               uploaded_by:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */

/**
 * @swagger
 * /attachment/{taskId}:
 *   get:
 *     summary: Get all attachments for a specific task
 *     tags: [Attachments]
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
 *         description: List of attachments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attachment'
 */

/**
 * @swagger
 * /attachment/download/{key}:
 *   get:
 *     summary: Generate a temporary download link for a file
 *     tags: [Attachments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Key of the file stored in Zata S3
 *     responses:
 *       200:
 *         description: Download link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 */

/**
 * @swagger
 * /attachment/{id}:
 *   delete:
 *     summary: Delete an attachment by ID
 *     tags: [Attachments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the attachment
 *     responses:
 *       204:
 *         description: Attachment deleted successfully
 */
