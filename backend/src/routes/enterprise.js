const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authenticateToken = require('../middleware/authMiddleware');
const priceService = require('../services/priceService');

const matchingController = require('../controllers/matchingController');
const driverController = require('../controllers/driverController');
const financialController = require('../controllers/financialController');
const reportController = require('../controllers/reportController');

// Team Management
router.get('/team', authenticateToken, teamController.getTeamMembers);
router.post('/team', authenticateToken, teamController.addTeamMember);

// Drivers
router.get('/drivers', authenticateToken, driverController.getMyDrivers);
router.post('/drivers', authenticateToken, driverController.addDriver);
router.put('/drivers/:id', authenticateToken, driverController.updateDriver);
router.delete('/drivers/:id', authenticateToken, driverController.deleteDriver);

// Price Estimation
router.post('/price-estimate', authenticateToken, (req, res) => {
    const { weight_kg, vehicle_type, distance_km } = req.body;
    const estimation = priceService.calculatePrice(weight_kg, vehicle_type, distance_km || 500);
    res.json(estimation);
});

// Bidding & Matching
router.post('/empty-vehicle', authenticateToken, matchingController.postEmptyVehicle);
router.get('/matches', authenticateToken, matchingController.findMatches);
router.get('/market-trends', authenticateToken, matchingController.getMarketTrends);
router.post('/smart-bid', authenticateToken, matchingController.oneClickBid);

// Financials
router.get('/financials/summary', authenticateToken, financialController.getFinancialSummary);
router.get('/financials/transactions', authenticateToken, financialController.getTransactions);

// Reports
router.get('/reports/performance', authenticateToken, reportController.getPerformanceStats);
router.get('/reports/history', authenticateToken, reportController.getHistoryData);

module.exports = router;
