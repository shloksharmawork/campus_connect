const express = require('express');
const { getMyProfile, getOnlineUsers, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', getMyProfile);
router.get('/online', getOnlineUsers);
router.get('/all', getAllUsers);

module.exports = router;
