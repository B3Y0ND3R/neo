const mongoose = require("mongoose");

const filterSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["category", "color", "gender", "brand", "rating"],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Filter", filterSchema);
