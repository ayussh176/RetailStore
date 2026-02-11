import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, fetchCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const placeOrder = async () => {
        try {
            await api.post('/orders/place');
            fetchCart(); // Clear cart in context
            navigate('/orders');
        } catch (error) {
            console.error(error);
            alert('Failed to place order: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(id, parseInt(newQuantity));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                            <li key={item.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-16 w-16">
                                        <img className="h-16 w-16 rounded-md object-cover" src={item.image_url || 'https://via.placeholder.com/150'} alt={item.name} />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                        <div className="flex items-center mt-1">
                                            <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</label>
                                            <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="p-1 border rounded-l bg-gray-100 hover:bg-gray-200">-</button>
                                            <input
                                                id={`quantity-${item.id}`}
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                className="w-12 text-center border-t border-b border-gray-300 py-1"
                                            />
                                            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="p-1 border rounded-r bg-gray-100 hover:bg-gray-200">+</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-900 font-medium mr-4">${(item.price * item.quantity).toFixed(2)}</span>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-900">Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="px-4 py-5 sm:p-6 bg-gray-50 flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">Total: ${cartTotal.toFixed(2)}</span>
                        <button onClick={placeOrder} className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">Place Order</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
