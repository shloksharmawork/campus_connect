const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'missing',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'missing',
  },
});

const uploadToS3 = async (file) => {
  // FALLBACK: If credentials are placeholders or missing, simulate/store locally for development
  if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID.includes('your-')) {
    console.warn('⚠️ AWS S3 credentials missing. Using local development fallback.');
    
    // In a real dev environment, we would save to /public/uploads
    // For now, we'll return a localized URL or error out with a descriptive message
    throw new Error('S3_CREDENTIALS_MISSING: Please configure AWS_ACCESS_KEY_ID in backend/.env');
  }

  const fileName = `voice-notes/${Date.now()}-${file.originalname}`;
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // Ensure public access if supported
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('❌ S3 Upload Error Details:', error);
    throw new Error(`S3_UPLOAD_FAILED: ${error.message}`);
  }
};

module.exports = {
  uploadToS3,
};
