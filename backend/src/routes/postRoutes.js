const express = require('express');
const multer = require('multer');
const { createTextPost, createVoicePost, createImagePost, getFeed, deletePost, reactToPost, refreshAudioUrl } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB for all media
});

router.use(authMiddleware);

router.get('/feed', getFeed);
router.post('/text', createTextPost);
router.post('/voice', upload.single('audio'), createVoicePost);
router.post('/image', upload.single('image'), createImagePost);
router.post('/:id/react', reactToPost);
router.post('/:id/refresh-audio', refreshAudioUrl);
router.delete('/:id', deletePost);

module.exports = router;
