const reviewModel = require("../models/ReviewModel");

// Add a review
const addReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    const newReview = await reviewModel.create({
      userId,
      productId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review added successfully",
      data: newReview,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get reviews by product
const getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await reviewModel.find({ productId }).populate("userId");

    res.status(200).json({
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addReview,
  getReviewsByProduct,
};