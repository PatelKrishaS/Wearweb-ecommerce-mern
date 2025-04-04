const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/WishlistController");

// Create wishlist
router.post("/", wishlistController.createWishlist);

// Add item to wishlist
router.post("/:userId/add/:productId", wishlistController.addToWishlist);

// Remove item from wishlist
router.delete("/:userId/remove/:productId", wishlistController.removeFromWishlist);

// Get user's wishlist
router.get("/:userId", wishlistController.getWishlistByUser);

module.exports = router;