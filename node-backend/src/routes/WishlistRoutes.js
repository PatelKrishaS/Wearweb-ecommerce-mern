const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/WishlistController");

// Create a wishlist
router.post("/create", wishlistController.createWishlist);

// Get wishlist by user
router.get("/user/:userId", wishlistController.getWishlistByUser);

module.exports = router;