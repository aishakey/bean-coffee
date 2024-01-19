import CoffeeShop from "../models/CoffeeShop.js";

export const getCoffeeShops = async (req, res) => {
  const { minReviews, location } = req.query;
  try {
    let query = {};

    if (minReviews) {
      query = { ...query, "reviews.0": { $exists: true } };
    }

    if (location) {
      query = { ...query, location: { $regex: location, $options: "i" } };
    }

    const coffeeShops = await CoffeeShop.find(query).populate("reviews");

    if (minReviews) {
      const filteredCoffeeShops = coffeeShops.filter(
        (shop) => shop.reviews.length >= parseInt(minReviews)
      );
      return res.status(200).json(filteredCoffeeShops);
    }

    return res.status(200).json(coffeeShops);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCoffeeShop = async (req, res) => {
  const { id } = req.params;

  try {
    const coffeeShop = await CoffeeShop.findById(id).populate({
      path: "reviews",
      populate: {
        path: "user",
        model: "User",
        select: "username",
      },
    });

    if (!coffeeShop)
      return res.status(404).json({ message: "Coffee Shop not found " });

    res.status(200).json(coffeeShop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
