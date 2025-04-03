const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "users", // Reference to the users collection
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categories", // Reference to the categories collection
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "subcategories", // Reference to the subcategories collection
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    baseprice: {
      type: Number,
      required: true,
    },
    offerprice: {
      type: Number,
    },
    offerPercentage: {
      type: Number,
    },
    hasSizes: {
      type:Boolean,
      default:false,
    },
    sizes: {
      type: [String], 
      enum: ["S", "M", "L", "XL", "XXL"], 
      required: false, 
    },
    dimensions: {
      length: { type: Number },  
      width: { type: Number }, // Width in cm or inches
      height: { type: Number }, // Height in cm or inches
    },
    color: {
      type: String,
    },
    material: {
      type: String,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    bestSeller: {
      type: Boolean,
      default: false
    },
    imageURL1: {
      type: String,
      // required: true,
    },
    imageURL2: {
      type: String,
    },
    imageURL3: {
      type: String,
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("products", productSchema);