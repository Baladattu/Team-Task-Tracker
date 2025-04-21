const { Attachment } = require('../models/Attachment.model');
const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3 = require('../utils/s3Client');
const { v4: uuidv4 } = require('uuid');

const uploadAttachment = async (req, res) => {
    const file = req.file;
    const fileKey = `${uuidv4()}_${file.originalname}`;

    await s3.send(new PutObjectCommand({
        Bucket: process.env.ZATA_BUCKET,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
    }));

    const fileUrl = `${process.env.ZATA_ENDPOINT}/${process.env.ZATA_BUCKET}/${fileKey}`;

    const attachment = await Attachment.create({
        task_id: req.body.task_id,
        uploaded_by: req.user.id,
        file_name: fileKey,
        file_url: fileUrl,
    });

    res.status(201).json(attachment);
};

const getAttachmentsByTask = async (req, res) => {
    const attachments = await Attachment.findAll({ where: { task_id: req.params.taskId } });
    res.json(attachments);
};

const getDownloadUrl = async (req, res) => {
    const command = new GetObjectCommand({
        Bucket: process.env.ZATA_BUCKET,
        Key: req.params.key,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    res.json({ downloadUrl: signedUrl });
};

const deleteAttachment = async (req, res) => {
    const attachment = await Attachment.findByPk(req.params.id);
    if (!attachment) return res.status(404).json({ error: 'Not found' });
    const fileKey = attachment.file_name;
    await s3.send(new DeleteObjectCommand({
        Bucket: process.env.ZATA_BUCKET,
        Key: fileKey,
    }));
    await attachment.destroy();
    res.json({ message: 'Deleted' });
};

module.exports = { uploadAttachment, getAttachmentsByTask, getDownloadUrl, deleteAttachment };
