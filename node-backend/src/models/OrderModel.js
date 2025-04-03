const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "users",
      required: true
    },
    products: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true
      },
      productName: String,
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      size: String,
      unitPrice: {
        type: Number,
        required: true,
        min: 0
      },
      image: String
    }],
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "user_addresses",
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'online'],
      required: true
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: { 
      type: String, 
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("orders", orderSchema);