import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, contactInfo, paymentMethod, totalAmount, deliveryNotes } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!contactInfo || !contactInfo.name || !contactInfo.email || !contactInfo.phone) {
            return res.status(400).json({
                success: false,
                message: 'Contact information is required'
            });
        }

        // Calculate total amount
        let calculatedTotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            calculatedTotal += product.price * item.quantity;
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount: calculatedTotal,
            shippingAddress,
            contactInfo: {
                name: contactInfo.name,
                email: contactInfo.email,
                phone: contactInfo.phone
            },
            paymentMethod: 'Cash on Delivery',
            deliveryNotes: deliveryNotes || '',
            status: 'Pending'
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Get single order
export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if the order belongs to the user
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        // Validate status
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};

// Update order
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, deliveryNotes } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Validate status if provided
        if (status) {
            const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status'
                });
            }
            order.status = status;
        }

        // Update delivery notes if provided
        if (deliveryNotes !== undefined) {
            order.deliveryNotes = deliveryNotes;
        }

        const updatedOrder = await order.save();

        res.status(200).json({
            success: true,
            message: 'Order updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order',
            error: error.message
        });
    }
};

// Delete order
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Only allow deletion of pending or cancelled orders
        if (!['Pending', 'Cancelled'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: 'Can only delete pending or cancelled orders'
            });
        }

        await order.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting order',
            error: error.message
        });
    }
}; 