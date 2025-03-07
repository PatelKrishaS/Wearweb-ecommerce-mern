const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAddressSchema = new Schema({
   
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    title: {
        type: String,
        enum: ["Home", "Office", "Other"],
        required: true
    },
    unitName: {
        type: String
    },
    street: {
        type: String
    },
    landMark: {
        type: String
    },
    cityId: {
        type: Schema.Types.ObjectId,
        ref: "cities",
        required: true
    },
    stateId: {
        type: Schema.Types.ObjectId,
        ref: "states",
        required: true
    },
    areaId: {
        type: Schema.Types.ObjectId,
        ref: "areas",
     },
    addressDetail: {
        type: String
    },
    zipCode: {
        type: String,
        required: true
    },
    
}, { timestamps: true });

module.exports = mongoose.model("user_addresses", userAddressSchema);
