const express = require("express");
const router = express.Router();
const cartItemController = require("../controllers/CartItemController");

// Add item to cart
router.post("/add", cartItemController.addItemToCart);

// Remove item from cart
router.delete("/remove/:id", cartItemController.removeItemFromCart);

module.exports = router;