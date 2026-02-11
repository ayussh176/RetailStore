const pool = require('../config/db');

exports.getCart = async (req, res) => {
    const userId = req.session.user.id;
    try {
        // Get or create cart
        let [cart] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
        if (cart.length === 0) {
            const [newCart] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
            cart = [{ id: newCart.insertId }];
        }

        const cartId = cart[0].id;
        const [items] = await pool.query(
            `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image_url 
             FROM cart_items ci 
             JOIN products p ON ci.product_id = p.id 
             WHERE ci.cart_id = ?`,
            [cartId]
        );

        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

exports.addToCart = async (req, res) => {
    const userId = req.session.user.id;
    const { productId, quantity } = req.body;

    try {
        // Get or create cart
        let [cart] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
        if (cart.length === 0) {
            const [newCart] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
            cart = [{ id: newCart.insertId }];
        }
        const cartId = cart[0].id;

        // Check if item exists in cart
        const [existing] = await pool.query(
            'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [cartId, productId]
        );

        if (existing.length > 0) {
            await pool.query(
                'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
                [quantity, existing[0].id]
            );
        } else {
            await pool.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [cartId, productId, quantity]
            );
        }

        res.json({ message: 'Added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        await pool.query('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
        res.json({ message: 'Removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error: error.message });
    }
};

exports.updateCartItemQuantity = async (req, res) => {
    const { quantity } = req.body;
    try {
        if (quantity <= 0) {
            await pool.query('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
            return res.json({ message: 'Item removed from cart' });
        }

        await pool.query(
            'UPDATE cart_items SET quantity = ? WHERE id = ?',
            [quantity, req.params.id]
        );
        res.json({ message: 'Cart updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
};
