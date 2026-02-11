const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware'); // Fixed module path

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Retailer only routes
router.post('/', isAuthenticated, hasRole('retailer'), productController.createProduct);
router.put('/:id', isAuthenticated, hasRole('retailer'), productController.updateProduct);
router.delete('/:id', isAuthenticated, hasRole('retailer'), productController.deleteProduct);

module.exports = router;
