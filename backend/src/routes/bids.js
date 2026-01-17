const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, bidController.placeBid);
router.get('/load/:loadId', authenticateToken, bidController.getBidsForLoad);
router.put('/:bidId/respond', authenticateToken, bidController.respondToBid);

module.exports = router;
