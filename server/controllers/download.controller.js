const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3 = require('../utils/s3Client');

module.exports = {
    downloadFile: async (req, res) => {
        try {
            const key = req.params.key;

            const command = new GetObjectCommand({
                Bucket: process.env.ZATA_BUCKET,
                Key: key
            })

            const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
            res.status(200).json({ downloadUrl: url });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}