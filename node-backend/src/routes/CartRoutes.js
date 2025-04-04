const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");

// Get or create cart
router.get("/user/:userId", cartController.getOrCreateCart);

// Add to cart
router.post("/user/:userId/add", cartController.addToCart);

// Update cart item
router.put("/user/:userId/item/:itemId", cartController.updateCartItem);

// Remove from cart
router.delete("/user/:userId/item/:itemId", cartController.removeFromCart);

// Clear cart
router.delete("/user/:userId/clear", cartController.clearCart);

module.exports = router;