const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/ReviewController");

// Add a review
router.post("/add", reviewController.addReview);

// Get reviews by product
router.get("/product/:productId", reviewController.getReviewsByProduct);

module.exports = router;