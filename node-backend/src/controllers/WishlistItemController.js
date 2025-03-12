const wishlistItemModel = require("../models/WishlistItemModel");

// Add item to wishlist
const addItemToWishlist = async (req, res) => {
  try {
    const { wishlistId, productId } = req.body;

    // Check if the product is already in the wishlist
    const existingItem = await wishlistItemModel.findOne({ wishlistId, productId });
    if (existingItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Add item to wishlist
    const newItem = await wishlistItemModel.create({ wishlistId, productId });
    res.status(201).json({
      message: "Item added to wishlist successfully",
      data: newItem,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from wishlist
const removeItemFromWishlist = async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await wishlistItemModel.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.status(200).json({
      message: "Item removed from wishlist successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addItemToWishlist,
  removeItemFromWishlist,
};