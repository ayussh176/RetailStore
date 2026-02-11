import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount, toggleMiniCart } = useCart();

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl text-indigo-600">RetailSys</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {user?.role === 'customer' && (
                                <>
                                    <Link to="/products" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium">Products</Link>
                                    <button onClick={toggleMiniCart} className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium">
                                        Cart
                                        {cartCount > 0 && <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">{cartCount}</span>}
                                    </button>
                                    <Link to="/orders" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium">My Orders</Link>
                                </>
                            )}
                            {user?.role === 'retailer' && (
                                <>
                                    <Link to="/retailer/dashboard" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium">Dashboard</Link>
                                    <Link to="/retailer/inventory" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium">Inventory</Link>
                                    <Link to="/retailer/orders" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium">Manage Orders</Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700">Hello, {user.username} ({user.role})</span>
                                <button onClick={logout} className="text-gray-500 hover:text-gray-700">Logout</button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-900">Login</Link>
                                <Link to="/register" className="text-gray-500 hover:text-gray-900">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
