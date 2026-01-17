const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/users', authenticateToken, adminController.getAllUsers);
router.put('/companies/:companyId/verify', authenticateToken, adminController.verifyCompany);

module.exports = router;
