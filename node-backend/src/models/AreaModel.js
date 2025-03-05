const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const areaSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Area name is required"],
      trim: true, // Removes unnecessary whitespace
      unique: true, // Ensures area names are unique
    },
    cityId: {
      type: Schema.Types.ObjectId,
      ref: "cities", // Reference to the City model
      required: [true, "City ID is required"],
    },
    stateId: {
      type: Schema.Types.ObjectId,
      ref: "states", // Reference to the State model
      required: [true, "State ID is required"],
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
      validate: {
        validator: function (value) {
          // Basic pincode validation (adjust regex as needed)
          return /^\d{5,6}(?:[-\s]\d{4})?$/.test(value);
        },
        message: "Invalid pincode format",
      },
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("areas", areaSchema);