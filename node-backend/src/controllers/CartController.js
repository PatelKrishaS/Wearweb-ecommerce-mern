const cartModel = require("../models/CartModel");

// Create a cart
const createCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if the user already has a cart
    const existingCart = await cartModel.findOne({ userId });
    if (existingCart) {
      return res.status(400).json({ message: "Cart already exists for this user" });
    }

    // Create a new cart
    const newCart = await cartModel.create({ userId });
    res.status(201).json({
      message: "Cart created successfully",
      data: newCart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get cart by user
const getCartByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await cartModel.findOne({ userId }).populate("items");

    res.status(200).json({
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCart,
  getCartByUser,
};