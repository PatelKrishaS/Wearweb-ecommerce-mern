const express = require("express");
const router = express.Router();
const razorpayController = require("../controllers/RazorPayController");

// Create Razorpay order
router.post("/create-order", razorpayController.createRazorpayOrder);

// Verify payment
router.post("/verify-payment", razorpayController.verifyPayment);

module.exports = router;