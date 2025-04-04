const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/WishlistController");

// Create a wishlist
router.post("/create", wishlistController.createWishlist);

// Get wishlist by user
router.get("/user/:userId", wishlistController.getWishlistByUser);

// Add to wishlist
router.post("/user/:userId/add/:productId", wishlistController.addToWishlist);

// Remove from wishlist
router.delete("/user/:userId/item/:productId", wishlistController.removeFromWishlist);

module.exports = router;