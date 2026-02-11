import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        try {
            const { data } = await api.get('/cart');
            setCartItems(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (productId, quantity = 1) => {
        if (!user) return alert('Please login first');
        try {
            await api.post('/cart/add', { productId, quantity });
            await fetchCart();
            setIsMiniCartOpen(true); // Open mini cart on add
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await api.delete(`/cart/remove/${cartItemId}`);
            setCartItems(prev => prev.filter(item => item.id !== cartItemId));
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        try {
            await api.put(`/cart/${cartItemId}`, { quantity });
            await fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const toggleMiniCart = () => setIsMiniCartOpen(!isMiniCartOpen);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            isMiniCartOpen,
            setIsMiniCartOpen,
            toggleMiniCart,
            cartCount,
            cartTotal,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
