const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId, 
      ref: "orders", // Reference to the orders collection
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
    },
    price: { 
      type: Number, 
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("orderDetails", orderDetailSchema);