const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("wishlists", wishlistSchema);