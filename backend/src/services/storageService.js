const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'missing',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'missing',
  },
});

const uploadToS3 = async (file) => {
  if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID.includes('your-')) {
    console.warn('⚠️ AWS S3 credentials missing.');
    throw new Error('S3_CREDENTIALS_MISSING: Please configure AWS_ACCESS_KEY_ID in backend/.env');
  }

  const fileName = `voice-notes/${Date.now()}-${Math.random().toString(36).slice(2)}.webm`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype || 'audio/webm',
    // No ACL param — bucket may have ACLs disabled (AWS default since 2023)
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    
    // Generate a long-lived pre-signed URL (7 days) to serve the audio
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
    });
    const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 604800 }); // 7 days
    console.log('✅ S3 upload success, signed URL generated');
    return signedUrl;
  } catch (error) {
    console.error('❌ S3 Upload Error Details:', error);
    throw new Error(`S3_UPLOAD_FAILED: ${error.message}`);
  }
};

module.exports = {
  uploadToS3,
};
