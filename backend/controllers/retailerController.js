const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const [products] = await pool.query('SELECT COUNT(*) as count FROM products');
        const [orders] = await pool.query('SELECT COUNT(*) as count FROM orders');
        const [users] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "customer"');
        const [revenue] = await pool.query('SELECT SUM(total_price) as total FROM orders WHERE status != "cancelled"');

        res.json({
            productCount: products[0].count,
            orderCount: orders[0].count,
            customerCount: users[0].count,
            totalRevenue: revenue[0].total || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};
