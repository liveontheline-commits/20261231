const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, vehicleController.addVehicle);
router.get('/', authenticateToken, vehicleController.getMyVehicles);
router.put('/:id', authenticateToken, vehicleController.updateVehicleStatus);
router.delete('/:id', authenticateToken, vehicleController.deleteVehicle);

module.exports = router;
