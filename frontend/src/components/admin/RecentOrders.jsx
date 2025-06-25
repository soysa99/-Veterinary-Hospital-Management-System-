import { FiShoppingBag, FiDollarSign, FiTruck } from 'react-icons/fi';

const RecentOrders = () => {
    const orders = [
        {
            id: '#ORD-2023-001',
            customer: 'John Doe',
            date: '2023-06-10',
            amount: '$89.97',
            status: 'Processing',
        },
        {
            id: '#ORD-2023-002',
            customer: 'Jane Smith',
            date: '2023-06-12',
            amount: '$45.99',
            status: 'Shipped',
        },
        {
            id: '#ORD-2023-003',
            customer: 'Robert Johnson',
            date: '2023-06-14',
            amount: '$32.98',
            status: 'Delivered',
        },
    ];

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{order.id}</h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                        'bg-green-100 text-green-800'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{order.customer}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FiShoppingBag className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span>{order.date}</span>
                            <FiDollarSign className="ml-3 mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span>{order.amount}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <a
                    href="#"
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    View all
                </a>
            </div>
        </div>
    );
};

export default RecentOrders;