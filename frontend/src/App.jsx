import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import MiniCart from './components/MiniCart';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage';
import OrderHistory from './pages/OrderHistory';
import RetailerDashboard from './pages/RetailerDashboard';
import InventoryManager from './pages/InventoryManager';
import OrderManager from './pages/OrderManager';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />; // Or unauthorized page
    }

    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="min-h-screen bg-gray-100">
                        <Navbar />
                        <MiniCart />
                        <main className="py-10">
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                <Routes>
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />

                                    {/* Customer Routes */}
                                    <Route path="/" element={<Navigate to="/products" />} />
                                    <Route path="/products" element={
                                        <ProtectedRoute roles={['customer']}>
                                            <ProductList />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/cart" element={
                                        <ProtectedRoute roles={['customer']}>
                                            <CartPage />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/orders" element={
                                        <ProtectedRoute roles={['customer']}>
                                            <OrderHistory />
                                        </ProtectedRoute>
                                    } />

                                    {/* Retailer Routes */}
                                    <Route path="/retailer/dashboard" element={
                                        <ProtectedRoute roles={['retailer']}>
                                            <RetailerDashboard />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/retailer/inventory" element={
                                        <ProtectedRoute roles={['retailer']}>
                                            <InventoryManager />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/retailer/orders" element={
                                        <ProtectedRoute roles={['retailer']}>
                                            <OrderManager />
                                        </ProtectedRoute>
                                    } />
                                </Routes>
                            </div>
                        </main>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
