const express = require('express');
const { sendRequest, respondRequest, getMyConnections, getPendingRequests } = require('../controllers/connectionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/request', sendRequest);
router.post('/respond/:connectionId', respondRequest);
router.get('/', getMyConnections);
router.get('/pending', getPendingRequests); // Requests received by the user

module.exports = router;
