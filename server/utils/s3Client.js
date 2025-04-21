const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: process.env.ZATA_REGION,
    endpoint: process.env.ZATA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.ZATA_ACCESS_KEY,
        secretAccessKey: process.env.ZATA_SECRET_KEY
    },
    forcePathStyle: true // Required for Zata
});

module.exports = s3;