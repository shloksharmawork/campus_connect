const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'missing',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'missing',
  },
});

const extractS3Key = (url) => {
  try { return new URL(url).pathname.slice(1); } catch { return null; }
};

// Generic S3 upload helper
const uploadFileToS3 = async (file, folder, expiresIn = 604800) => {
  const ext = (file.mimetype || '').split('/')[1] || 'bin';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  const signedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: fileName }),
    { expiresIn }
  );
  return signedUrl;
};

// Upload voice note (7-day URL)
const uploadToS3 = (file) => uploadFileToS3(file, 'voice-notes', 604800);

// Upload image (30-day URL)
const uploadImageToS3 = (file) => uploadFileToS3(file, 'post-images', 2592000);

// Refresh a signed URL for an existing S3 object
const getSignedAudioUrl = async (existingUrl) => {
  const key = extractS3Key(existingUrl);
  if (!key) throw new Error('Invalid URL');
  return await getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key }),
    { expiresIn: 604800 }
  );
};

module.exports = { uploadToS3, uploadImageToS3, getSignedAudioUrl };
