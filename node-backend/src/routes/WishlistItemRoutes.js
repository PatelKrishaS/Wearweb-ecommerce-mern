const express = require("express");
const router = express.Router();
const wishlistItemController = require("../controllers/WishlistItemController");

// Add item to wishlist
router.post("/add", wishlistItemController.addItemToWishlist);

// Remove item from wishlist
router.delete("/remove/:id", wishlistItemController.removeItemFromWishlist);

module.exports = router;