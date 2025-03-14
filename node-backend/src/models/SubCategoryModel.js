const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
    subCategoryName: {
        type: String,
        required: true,
        unique: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "categories",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("subcategories", subcategorySchema);
