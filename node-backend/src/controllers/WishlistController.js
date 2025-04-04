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
    
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const existingWishlist = await wishlistModel.findOne({ userId });
    if (existingWishlist) {
      return res.status(200).json(existingWishlist);
    }

    const newWishlist = await wishlistModel.create({ userId, items: [] });
    res.status(201).json(newWishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get wishlist by user
// In WishlistController.js
const getWishlistByUser = async (req, res) => {
  try {
    const wishlist = await wishlistModel.findOne({ userId: req.params.userId })
      .populate({
        path: 'items.productId',
        model: 'products',
        select: 'name baseprice offerprice imageURL1 stockQuantity sizes' // Include stockQuantity
      });
    
    if (!wishlist) return res.status(200).json({ items: [] });
    
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createWishlist,
  getWishlistByUser,
  addToWishlist,
  removeFromWishlist
};