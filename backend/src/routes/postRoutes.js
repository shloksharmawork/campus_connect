const express = require('express');
const multer = require('multer');
const { createTextPost, createVoicePost, getFeed, deletePost, reactToPost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.use(authMiddleware);

router.get('/feed', getFeed);
router.post('/text', createTextPost);
router.post('/voice', upload.single('audio'), createVoicePost);
router.post('/:id/react', reactToPost);   // Must be before /:id delete
router.delete('/:id', deletePost);

module.exports = router;
