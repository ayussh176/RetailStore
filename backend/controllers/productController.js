const pool = require('../config/db');

exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(products[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    let { name, description, price, stock_quantity, image_url, supplier_id } = req.body;

    // Handle empty fields
    if (!supplier_id) supplier_id = null;
    if (!image_url) image_url = null;

    try {
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, stock_quantity, image_url, supplier_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, stock_quantity, image_url, supplier_id]
        );
        res.status(201).json({ message: 'Product created', productId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    let { name, description, price, stock_quantity, image_url, supplier_id } = req.body;

    // Handle empty fields
    if (!supplier_id) supplier_id = null;
    if (!image_url) image_url = null;

    try {
        await pool.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, image_url = ?, supplier_id = ? WHERE id = ?',
            [name, description, price, stock_quantity, image_url, supplier_id, req.params.id]
        );
        res.json({ message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
