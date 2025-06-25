// src/pages/admin/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import {
    HomeIcon,
    UsersIcon,
    ShoppingBagIcon,
    CalendarIcon,
    WrenchScrewdriverIcon,
    ClipboardDocumentListIcon,
    Bars3Icon,
    XMarkIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    ShoppingCartIcon,
    ClockIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalAppointments: 0,
        totalServices: 0,
        recentOrders: [],
        recentAppointments: []
    });
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const [usersRes, ordersRes, appointmentsRes, servicesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/auth/users', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/appointments', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/services', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const orders = ordersRes.data.orders || [];
            const appointments = appointmentsRes.data || [];
            const services = servicesRes.data || [];

            setStats({
                totalUsers: usersRes.data.length || 0,
                totalOrders: orders.length || 0,
                totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
                totalAppointments: appointments.length || 0,
                totalServices: services.length || 0,
                recentOrders: orders.slice(0, 5),
                recentAppointments: appointments.slice(0, 5)
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navigation = [
        { name: 'Dashboard', to: '/admin', icon: HomeIcon },
        { name: 'Users', to: '/admin/users', icon: UsersIcon },
        { name: 'Products', to: '/admin/products', icon: ShoppingBagIcon },
        { name: 'Services', to: '/admin/services', icon: WrenchScrewdriverIcon },
        { name: 'Appointments', to: '/admin/appointments', icon: CalendarIcon },
        { name: 'Orders', to: '/admin/orders', icon: ClipboardDocumentListIcon },
    ];

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
                    <div className="flex h-16 items-center justify-between px-4">
                        <h2 className="text-xl font-semibold text-gray-900">Admin Panel</h2>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-500 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.to}
                                className={({ isActive }) =>
                                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <item.icon
                                    className={`mr-3 h-6 w-6 flex-shrink-0 ${location.pathname === item.to
                                        ? 'text-gray-500'
                                        : 'text-gray-400 group-hover:text-gray-500'
                                        }`}
                                />
                                {item.name}
                            </NavLink>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 hover:text-red-900"
                        >
                            <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-red-400 group-hover:text-red-500" />
                            Logout
                        </button>
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
                    <div className="flex h-16 items-center px-4">
                        <h2 className="text-xl font-semibold text-gray-900">Admin Panel</h2>
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.to}
                                className={({ isActive }) =>
                                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <item.icon
                                    className={`mr-3 h-6 w-6 flex-shrink-0 ${location.pathname === item.to
                                        ? 'text-gray-500'
                                        : 'text-gray-400 group-hover:text-gray-500'
                                        }`}
                                />
                                {item.name}
                            </NavLink>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 hover:text-red-900"
                        >
                            <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-red-400 group-hover:text-red-500" />
                            Logout
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {location.pathname === '/admin' ? (
                            <div className="space-y-6">
                                {/* Welcome Section */}
                                <div className="bg-white shadow rounded-lg overflow-hidden">
                                    <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-700">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">
                                                    Welcome back, {user?.firstName} {user?.lastName}!
                                                </h2>
                                                <p className="mt-1 text-sm text-blue-100">
                                                    {new Date().toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <p className="text-sm text-blue-100">Role</p>
                                                    <p className="text-lg font-semibold text-white">Administrator</p>
                                                </div>
                                                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <span className="text-xl font-bold text-white">
                                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{user?.phone || 'Not provided'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {new Date().toLocaleString()}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                    {/* Total Users */}
                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="p-5">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <UserGroupIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                                        <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Revenue */}
                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="p-5">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                                                        <dd className="text-lg font-medium text-gray-900">{formatCurrency(stats.totalRevenue)}</dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Orders */}
                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="p-5">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <ShoppingCartIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                                                        <dd className="text-lg font-medium text-gray-900">{stats.totalOrders}</dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Appointments */}
                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="p-5">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <ClockIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
                                                        <dd className="text-lg font-medium text-gray-900">{stats.totalAppointments}</dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                    {/* Recent Orders */}
                                    <div className="bg-white shadow rounded-lg">
                                        <div className="px-4 py-5 sm:px-6">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Orders</h3>
                                        </div>
                                        <div className="border-t border-gray-200">
                                            <ul className="divide-y divide-gray-200">
                                                {stats.recentOrders.map((order) => (
                                                    <li key={order._id} className="px-4 py-4 sm:px-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <div className="ml-3">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        Order #{order._id.slice(-6)}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {order.contactInfo.name} - {formatCurrency(order.totalAmount)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="ml-2 flex-shrink-0">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                                                'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Recent Appointments */}
                                    <div className="bg-white shadow rounded-lg">
                                        <div className="px-4 py-5 sm:px-6">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Appointments</h3>
                                        </div>
                                        <div className="border-t border-gray-200">
                                            <ul className="divide-y divide-gray-200">
                                                {stats.recentAppointments.map((appointment) => (
                                                    <li key={appointment._id} className="px-4 py-4 sm:px-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <div className="ml-3">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {appointment.user?.firstName} {appointment.user?.lastName}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {appointment.service} - {formatDate(appointment.date)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="ml-2 flex-shrink-0">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                    appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                            'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {appointment.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Outlet />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
