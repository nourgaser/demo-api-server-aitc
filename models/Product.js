const mongoose = require("mongoose");
const Review = require("./Review");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  brand: String,
  images: [String],
  categories: [String],
  price: Number,
  quantity: Number,
  reviews: [Review.schema],
}, {strict: false, strictQuery: false});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
