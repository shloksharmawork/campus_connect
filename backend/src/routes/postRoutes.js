const express = require('express');
const multer = require('multer');
const { createTextPost, createVoicePost, getFeed, deletePost, reactToPost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.use(authMiddleware);

router.post('/text', createTextPost);
router.post('/voice', upload.single('audio'), createVoicePost);
router.delete('/:id', deletePost);
router.get('/feed', getFeed);
router.post('/:id/react', reactToPost);

module.exports = router;
