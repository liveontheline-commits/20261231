const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const reviewController = require('../controllers/reviewController');
const addressBookController = require('../controllers/addressBookController');
const authenticateToken = require('../middleware/authMiddleware');

// Messaging
router.get('/messages/:loadId', authenticateToken, messageController.getMessages);
router.post('/messages', authenticateToken, messageController.sendMessage);

// Reviews
router.post('/reviews', authenticateToken, reviewController.addReview);
router.get('/reviews/:companyId', authenticateToken, reviewController.getCompanyReviews);

// LEGACY SUPPORT: Some clients might still hit the old features path
router.get('/address-book', authenticateToken, addressBookController.getAddressBook);
router.post('/address-book', authenticateToken, addressBookController.addAddress);


module.exports = router;
