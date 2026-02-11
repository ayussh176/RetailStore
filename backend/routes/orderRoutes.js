const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware');

router.use(isAuthenticated);

router.post('/place', hasRole('customer'), orderController.placeOrder);
router.get('/history', hasRole('customer'), orderController.getMyOrders);
router.get('/:id', orderController.getOrderDetails); // Shared, logic inside could restrict but basic usage is fine

module.exports = router;
