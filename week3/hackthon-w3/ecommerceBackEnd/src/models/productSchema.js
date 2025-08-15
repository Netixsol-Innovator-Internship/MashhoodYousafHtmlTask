const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // link from Cloudinary or other storage
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
