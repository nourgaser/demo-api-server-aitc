const mongoose = require("mongoose");

const ERR_MSG = "Value of star rating must be an integer between 0 and 5";

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.ObjectId, required: true },
  user: { type: mongoose.ObjectId, required: true },
  stars: { type: Number, required: true, min: [0, ERR_MSG], max: [5, ERR_MSG] },
  body: { type: String },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
