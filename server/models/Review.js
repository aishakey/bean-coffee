import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  coffeeShop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoffeeShop",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  wifiSpeed: { type: String, required: true },
  seating: { type: String, required: true },
  vibe: { type: String, required: true },
  food: { type: String, required: true },
  drink: { type: String, required: true },
  noisy: { type: String, required: true },
  additionalComments: String,
  photos: [{ type: String }],
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
