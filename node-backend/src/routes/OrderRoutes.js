const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

// Create an order
router.post("/create", orderController.createOrder);

// Get orders by user
router.get("/user/:userId", orderController.getOrdersByUser);

router.get('/:orderId', orderController.getOrderDetails);

router.patch("/:orderId/cancel", orderController.cancelOrder);

router.patch("/:orderId/status", orderController.updateOrderStatus);

router.get("/seller/:sellerId", orderController.getOrdersBySeller);

module.exports = router;