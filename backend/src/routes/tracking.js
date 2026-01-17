const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/:loadId/history', authenticateToken, trackingController.getTrackingHistory);
router.post('/update', authenticateToken, trackingController.addTrackingUpdate);
router.get('/my-jobs', authenticateToken, trackingController.getTransporterJobs);

module.exports = router;
