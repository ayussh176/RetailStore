const express = require('express');
const router = express.Router();
const retailerController = require('../controllers/retailerController');
const orderController = require('../controllers/orderController');
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware');

router.use(isAuthenticated);
router.use(hasRole('retailer'));

router.get('/stats', retailerController.getDashboardStats);
router.get('/orders', orderController.getAllOrders);
router.patch('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router;
