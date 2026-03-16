const express = require('express');
const multer = require('multer');
const { createTextPost, createVoicePost, getFeed, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Configure multer for memory storage (buffer)
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit for voice notes
  },
});

router.use(authMiddleware);

router.post('/text', createTextPost);
router.post('/voice', upload.single('audio'), createVoicePost);
router.delete('/:id', deletePost);
router.get('/feed', getFeed);

module.exports = router;
