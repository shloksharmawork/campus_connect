const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'missing',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'missing',
  },
});

// Extract S3 key from a stored URL (handles both old public URLs and new signed URLs)
const extractS3Key = (url) => {
  try {
    const parsed = new URL(url);
    // Old format: https://bucket.s3.region.amazonaws.com/voice-notes/xxx
    // New format: https://bucket.s3.region.amazonaws.com/voice-notes/xxx?X-Amz-...
    return parsed.pathname.slice(1); // Remove leading /
  } catch {
    return null;
  }
};

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
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
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

// Refresh a signed URL for an existing S3 object (fixes old broken public URLs)
const getSignedAudioUrl = async (existingUrl) => {
  const key = extractS3Key(existingUrl);
  if (!key) throw new Error('Invalid URL');

  const getCommand = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(s3Client, getCommand, { expiresIn: 604800 }); // 7 days
};

module.exports = {
  uploadToS3,
  getSignedAudioUrl,
};
