const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    details: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true
      },
      productName: String,
      quantity: Number,
      size: String,
      unitPrice: Number,
      image: String
    }]
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("orders", orderSchema);