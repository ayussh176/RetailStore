import { useEffect, useState } from 'react';
import api from '../utils/api';

const RetailerDashboard = () => {
    const [stats, setStats] = useState({
        productCount: 0,
        orderCount: 0,
        customerCount: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/retailer/stats');
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.productCount}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.orderCount}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.customerCount}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">${stats.totalRevenue}</dd>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetailerDashboard;
