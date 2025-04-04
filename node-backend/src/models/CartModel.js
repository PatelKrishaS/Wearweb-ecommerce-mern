const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  size: String,
  price: {
    type: Number,
    required: true
  },
  image: String,
  name: String
}, { _id: true });

const cartSchema = new Schema(
  {
  userId: {
    type: Schema.Types.ObjectId,
      ref: "users",
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
    }
  },
  { timestamps: true }
);

// Calculate total before saving
cartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  next();
});

module.exports = mongoose.model("carts", cartSchema);