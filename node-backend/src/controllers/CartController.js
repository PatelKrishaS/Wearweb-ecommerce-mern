const cartModel = require("../models/CartModel");

// Get or create cart for user
const getOrCreateCart = async (req, res) => {
  try {
    const { userId } = req.params;

    let cart = await cartModel.findOne({ userId }).populate('items.productId');
    if (!cart) {
      cart = await cartModel.create({ userId, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity, size, price, image, name } = req.body;

    // Validate input
    if (!productId || !quantity || !price || !name) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields" 
      });
    }

    let cart = await cartModel.findOne({ userId });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = new cartModel({ userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.equals(productId) && 
      (size ? item.size === size : true)
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        productId,
        quantity, 
        size: size || null,
        price,
        image,
        name
      });
    }

    await cart.save();

    res.status(200).json({ 
      success: true,
      message: "Item added to cart",
      data: await cartModel.findById(cart._id).populate('items.productId')
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ 
        success: false,
        message: "Quantity must be at least 1" 
      });
    }

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: "Cart not found" 
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id.equals(itemId));
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: "Item not found in cart" 
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: await cartModel.findById(cart._id).populate('items.productId')
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: "Cart not found" 
      });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => !item._id.equals(itemId));
    
    if (cart.items.length === initialLength) {
      return res.status(404).json({ 
        success: false,
        message: "Item not found in cart" 
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: await cartModel.findById(cart._id).populate('items.productId')
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: "Cart not found" 
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: cart
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

module.exports = {
  getOrCreateCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};