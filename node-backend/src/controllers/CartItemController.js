const cartItemModel = require("../models/CartItemModel");

// Add item to cart
const addItemToCart = async (req, res) => {
  try {
    const { cartId, productId, quantity } = req.body;

    // Check if the product is already in the cart
    const existingItem = await cartItemModel.findOne({ cartId, productId });
    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return res.status(200).json({
        message: "Cart updated successfully",
        data: existingItem,
      });
    }

    // Add item to cart
    const newItem = await cartItemModel.create({ cartId, productId, quantity });
    res.status(201).json({
      message: "Item added to cart successfully",
      data: newItem,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
const removeItemFromCart = async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await cartItemModel.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    res.status(200).json({
      message: "Item removed from cart successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addItemToCart,
  removeItemFromCart,
};