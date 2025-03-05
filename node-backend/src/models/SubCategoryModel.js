const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true
    },
    subCategoryName: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("subcategories", SubCategorySchema);
