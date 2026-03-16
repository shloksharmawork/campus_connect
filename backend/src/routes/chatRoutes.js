const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/chatController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/:friendId', getMessages);
router.post('/', sendMessage);

module.exports = router;
