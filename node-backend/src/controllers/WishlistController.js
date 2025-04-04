const wishlistModel = require("../models/WishlistModel");

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const wishlist = await wishlistModel.findOneAndUpdate(
      { userId },
      { $addToSet: { items: { productId } } },
      { new: true, upsert: true }
    ).populate('items.productId');
    
    res.status(200).json({
      message: "Product added to wishlist",
      data: wishlist
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const wishlist = await wishlistModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate('items.productId');
    
    res.status(200).json({
      message: "Product removed from wishlist",
      data: wishlist
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Create a wishlist
const createWishlist = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if the user already has a wishlist
    const existingWishlist = await wishlistModel.findOne({ userId });
    if (existingWishlist) {
      return res.status(400).json({ message: "Wishlist already exists for this user" });
    }

    // Create a new wishlist
    const newWishlist = await wishlistModel.create({ userId });
    res.status(201).json({
      message: "Wishlist created successfully",
      data: newWishlist,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get wishlist by user
const getWishlistByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const wishlist = await wishlistModel.findOne({ userId }).populate("items");

    res.status(200).json({
      message: "Wishlist fetched successfully",
      data: wishlist,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createWishlist,
  getWishlistByUser,
};