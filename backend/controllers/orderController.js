const pool = require('../config/db');

exports.placeOrder = async (req, res) => {
    const userId = req.session.user.id;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Get Cart
        const [cart] = await connection.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
        if (cart.length === 0) throw new Error('Cart not found');
        const cartId = cart[0].id;

        // Get Cart Items
        const [cartItems] = await connection.query(
            `SELECT ci.product_id, ci.quantity, p.price, p.stock_quantity 
             FROM cart_items ci 
             JOIN products p ON ci.product_id = p.id 
             WHERE ci.cart_id = ?`,
            [cartId]
        );

        if (cartItems.length === 0) throw new Error('Cart is empty');

        let totalPrice = 0;
        // Check stock and calculate total
        for (const item of cartItems) {
            if (item.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for product ID ${item.product_id}`);
            }
            totalPrice += item.price * item.quantity;
        }

        // Create Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
            [userId, totalPrice, 'pending']
        );
        const orderId = orderResult.insertId;

        // Create Order Items and Update Stock
        for (const item of cartItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
            await connection.query(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Clear Cart
        await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

        await connection.commit();
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Error placing order', error: error.message });
    } finally {
        connection.release();
    }
};

exports.getMyOrders = async (req, res) => {
    const userId = req.session.user.id;
    try {
        const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const [orderItems] = await pool.query(
            `SELECT oi.*, p.name 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`,
            [req.params.id]
        );
        res.json(orderItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order details', error: error.message });
    }
};

// Retailer: Get All Orders
exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT o.*, u.username 
             FROM orders o 
             JOIN users u ON o.user_id = u.id 
             ORDER BY o.created_at DESC`
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all orders', error: error.message });
    }
};

// Retailer: Update Status
exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};
