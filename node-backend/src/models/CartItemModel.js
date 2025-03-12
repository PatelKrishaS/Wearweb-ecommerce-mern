const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    cartId: {
      type: Schema.Types.ObjectId,
      ref: "carts", // Reference to the carts collection
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products", // Reference to the products collection
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("cartItems", cartItemSchema);