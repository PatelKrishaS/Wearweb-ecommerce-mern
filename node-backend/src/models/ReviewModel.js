const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products", 
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("reviews", reviewSchema);