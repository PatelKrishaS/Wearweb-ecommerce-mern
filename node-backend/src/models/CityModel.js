const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const citySchema = new Schema({
   
    cityName: {
        type: String,
        required: true,
        unique: true
    },
    stateId: {
        type: Schema.Types.ObjectId,
        ref: "states",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("cities", citySchema);
