const express = require('express');
const { downloadFile } = require('../controllers/download.controller');

const downloadRouter = express.Router();

downloadRouter.get('/:key', downloadFile);

module.exports = downloadRouter;