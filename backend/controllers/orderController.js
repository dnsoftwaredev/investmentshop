import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';

// all the functionality will be assigned here in order to keep routes/productRoute.js clean 

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.legnth === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice,
            user: req.user._id
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }

});

export {
    addOrderItems
};