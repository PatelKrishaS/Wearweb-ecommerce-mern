const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stateSchema = new Schema({

    stateName: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    }
}, { timestamps: true });

module.exports = mongoose.model("states", stateSchema);
