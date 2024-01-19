import mongoose from "mongoose";

const coffeeShopSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  mainPhoto: {
    type: String,
    required: true,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

const CoffeeShop = mongoose.model("CoffeeShop", coffeeShopSchema);

export default CoffeeShop;
