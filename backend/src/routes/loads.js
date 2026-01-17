const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, loadController.createLoad);
router.get('/', loadController.getLoads);
router.get('/open', loadController.getLoads); // Added for frontend compatibility
router.get('/my-loads', authenticateToken, loadController.getMyLoads);
router.get('/:id', authenticateToken, loadController.getLoadById);
router.delete('/:id', authenticateToken, loadController.deleteLoad);

module.exports = router;
