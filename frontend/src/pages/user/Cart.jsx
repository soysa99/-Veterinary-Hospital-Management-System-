import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { getCartItems, updateCartItemQuantity, removeFromCart } from '../../utils/cartUtils';
import axios from 'axios';

function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCartItems();
    }, []);

    const loadCartItems = async () => {
        try {
            setLoading(true);
            const items = getCartItems();

            // Fetch product details for each cart item
            const itemsWithDetails = await Promise.all(
                items.map(async (item) => {
                    try {
                        const response = await axios.get(`http://localhost:5000/api/products/${item._id}`);
                        if (response.data.success) {
                            return {
                                ...item,
                                ...response.data.product,
                                price: response.data.product.price
                            };
                        }
                        return item;
                    } catch (error) {
                        console.error(`Error fetching product ${item._id}:`, error);
                        return item;
                    }
                })
            );

            setCartItems(itemsWithDetails);
        } catch (error) {
            setError('Error loading cart items');
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedItems = updateCartItemQuantity(id, newQuantity);
        setCartItems(updatedItems);
    };

    const removeItem = (id) => {
        const updatedItems = removeFromCart(id);
        setCartItems(updatedItems);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600 text-center">
                    <h2 className="text-xl font-semibold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                                <button
                                    onClick={() => navigate('/shop')}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <ul role="list" className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <li key={item._id} className="py-6 flex">
                                        <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-center object-cover"
                                            />
                                        </div>

                                        <div className="ml-4 flex-1 flex flex-col">
                                            <div className="flex justify-between">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {item.name}
                                                </h3>
                                                <p className="ml-4 text-lg font-medium text-gray-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        className="px-2 py-1 border rounded-md hover:bg-gray-100"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-4">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        className="px-2 py-1 border rounded-md hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item._id)}
                                                    className="text-red-600 hover:text-red-500"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Subtotal</p>
                                    <p className="text-gray-900">${subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Tax (10%)</p>
                                    <p className="text-gray-900">${tax.toFixed(2)}</p>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <p className="text-lg font-medium text-gray-900">Total</p>
                                        <p className="text-lg font-medium text-gray-900">${total.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/checkout')}
                                disabled={cartItems.length === 0}
                                className={`mt-6 w-full ${cartItems.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white px-4 py-2 rounded-md transition-colors duration-300`}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;