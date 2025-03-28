const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    }
}, { timestamps: true });

module.exports = mongoose.model("categories", categorySchema);
