const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistItemSchema = new Schema(
  {
    wishlistId: {
      type: Schema.Types.ObjectId,
      ref: "wishlists", // Reference to the wishlists collection
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products", // Reference to the products collection
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("wishlistItems", wishlistItemSchema);