const reviewModel = require("../models/ReviewModel");
const ProductModel = require("../models/ProductListingModel");

// Add a review
const addReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    // Basic validation
    if (!userId || !productId || !rating) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields (userId, productId, or rating)"
      });
    }

    // Create new review
    const newReview = await reviewModel.create({
      userId,
      productId,
      rating,
      comment
    });

    // Get all reviews for this product
    const productReviews = await reviewModel.find({ productId });

    // Calculate new average rating
    const totalRatings = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRatings / productReviews.length;

    // Update the product
    await ProductModel.findByIdAndUpdate(productId, {
      reviewCount: productReviews.length,
      averageRating: parseFloat(averageRating.toFixed(1)) // Round to 1 decimal
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview
    });

  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review"
    });
  }
};

// Get reviews for a product
const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await reviewModel.find({ productId: req.params.productId })
      .populate('userId', 'name');
    
    // Calculate average rating
    let averageRating = 0;
    if (reviews.length > 0) {
      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = total / reviews.length;
    }

    // Update the product's rating
    await ProductModel.findByIdAndUpdate(req.params.productId, {
      averageRating,
      reviewCount: reviews.length
    });

    res.status(200).json({
      success: true,
      reviews,
      count: reviews.length,
      averageRating
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews"
    });
  }
};

module.exports = {
  addReview,
  getReviewsByProduct
};