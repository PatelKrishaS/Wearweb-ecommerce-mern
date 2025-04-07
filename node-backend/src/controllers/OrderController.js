const mongoose = require('mongoose');
const orderModel = require("../models/OrderModel");

// Create an order
const createOrder = async (req, res) => {
  try {
    const { userId, products, shippingAddress, paymentMethod } = req.body;

    // Validate required fields
    if (!userId || !products || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing required order fields"
      });
    }

    // Validate payment method
    if (!['cod', 'online'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method"
      });
    }

    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products must be a non-empty array"
      });
    }

    // Calculate subtotal and validate products
    const DELIVERY_CHARGE = 10;
    let subtotal = 0;
    
    const orderDetails = products.map(product => {
      if (!product.productId || !product.quantity || !product.price || !product.productName) {
        throw new Error("Invalid product data structure");
      }
      
      if (product.quantity < 1 || product.price <= 0) {
        throw new Error("Invalid product quantity or price");
      }

      subtotal += product.price * product.quantity;
      
      return {
        productId: product.productId,
        productName: product.productName || 'Unnamed Product',
        quantity: product.quantity,
        size: product.size || 'One Size',
        unitPrice: product.price,
        image: product.image || ''
      };
    });

    // Calculate total amount
    const totalAmount = paymentMethod === 'cod' ? subtotal + DELIVERY_CHARGE : subtotal;

    // Create order
    const newOrder = await orderModel.create({
      userId,
      products: orderDetails,
      shippingAddress,
      paymentMethod,
      totalAmount,
      deliveryCharge: paymentMethod === 'cod' ? DELIVERY_CHARGE : 0,
      status: 'Processing' // All orders start as Processing
    });

    // Properly populate all relationships
    const populatedOrder = await orderModel.findById(newOrder._id)
      .populate({
        path: 'products.productId',
        select: 'name imageURL1 baseprice',
        model: 'products'
      })
      .populate({
        path: 'shippingAddress',
        select: 'title unitName street landMark addressDetail zipCode',
        populate: [
          {
            path: 'cityId',
            select: 'cityName',
            model: 'cities' // Ensure this matches your model name
          },
          {
            path: 'stateId',
            select: 'stateName',
            model: 'states' // Ensure this matches your model name
          }
        ]
      })
      .lean();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        ...populatedOrder,
        subtotal,
        deliveryCharge: paymentMethod === 'cod' ? DELIVERY_CHARGE : 0
      }
    });

  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Get orders by user
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid user ID format" 
      });
    }

    const orders = await orderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'products.productId',
        select: 'name imageURL1 baseprice offerprice',
        model: 'products'
      })
      .populate({
        path: 'shippingAddress',
        select: 'title unitName street landMark addressDetail zipCode',
        populate: [
          {
            path: 'cityId',
            select: 'cityName',
            model: 'cities'
          },
          {
            path: 'stateId',
            select: 'stateName',
            model: 'states'
          }
        ]
      })
      .lean();

    const transformedOrders = orders.map(order => ({
      ...order,
      products: order.products.map(item => ({
        ...item,
        productId: item.productId?._id || item.productId,
        product: item.productId || { name: '[Deleted Product]' },
        totalPrice: (item.unitPrice * item.quantity).toFixed(2)
      })),
      // Format address for frontend
      formattedAddress: order.shippingAddress ? [
        order.shippingAddress.unitName,
        order.shippingAddress.street,
        order.shippingAddress.landMark,
        order.shippingAddress.addressDetail,
        order.shippingAddress.cityId?.cityName,
        order.shippingAddress.stateId?.stateName,
        order.shippingAddress.zipCode
      ].filter(Boolean).join(', ') : 'Address not available'
    }));

    res.status(200).json({ 
      success: true,
      count: transformedOrders.length,
      data: transformedOrders
    });

  } catch (err) {
    console.error("Order fetch error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching orders",
      error: err.message
    });
  }
};

// Get single order details
const getOrderDetails = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId)
      .populate({
        path: 'products.productId',
        select: 'name imageURL1 price',
        model: 'products'
      })
      .populate({
        path: 'shippingAddress',
        select: 'title unitName street landMark addressDetail zipCode',
        populate: [
          {
            path: 'cityId',
            select: 'cityName',
            model: 'cities'
          },
          {
            path: 'stateId',
            select: 'stateName',
            model: 'states'
          }
        ]
      });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: order 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if order can be cancelled (only Processing orders can be cancelled)
    if (order.status !== 'Processing') {
      return res.status(400).json({ 
        success: false, 
        message: 'Order cannot be cancelled at this stage' 
      });
    }

    // Update order status
    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ 
      success: true, 
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderDetails,
  cancelOrder
};