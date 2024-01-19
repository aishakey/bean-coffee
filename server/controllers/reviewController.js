import Review from "../models/Review.js";
import CoffeeShop from "../models/CoffeeShop.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import Filter from "bad-words";
import s3 from "../services/awsConfig.js";

export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.find({ user: userId }).populate("coffeeShop");
    res.json(reviews);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const checkCoffeeshopExistence = async (req, res) => {
  const { location } = req.query;

  try {
    const coffeeShop = await CoffeeShop.findOne({ location });
    res.json({ exists: !!coffeeShop });
  } catch (error) {
    console.error("Error in check CS existence:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const filter = new Filter();
  const { userId, coffeeShopDetails, reviewContent, photoUrls } = req.body;

  try {
    coffeeShopDetails.name = filter.clean(coffeeShopDetails.name);
    reviewContent.title = filter.clean(reviewContent.title);
    if (reviewContent.additionalComments) {
      reviewContent.additionalComments = filter.clean(
        reviewContent.additionalComments
      );
    }
    let coffeeShop = await CoffeeShop.findOne({
      location: coffeeShopDetails.location,
    });

    if (!coffeeShop) {
      if (!photoUrls || photoUrls.length === 0) {
        return res
          .status(400)
          .json({ message: "First review must include a main photo" });
      }
      coffeeShop = new CoffeeShop({
        ...coffeeShopDetails,
        mainPhoto: photoUrls[0],
      });
    }
    await coffeeShop.save();

    const review = new Review({
      user: userId,
      coffeeShop: coffeeShop._id,
      ...reviewContent,
      photos: photoUrls,
    });
    await review.save();

    await User.findByIdAndUpdate(userId, { $push: { reviews: review._id } });
    await CoffeeShop.findByIdAndUpdate(coffeeShop._id, {
      $push: { reviews: review._id },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error in createReview:", error);
    res.status(400).json({ message: error.message });
  }
};

export const uploadPhotos = async (req, res) => {
  try {
    const validatedFiles = req.files.map((file) => {
      if (!file.mimetype.startsWith("image/")) {
        throw new Error("Invalid file type. Only images are allowed.");
      }
      if (file.size > 5000000) {
        throw new Error("File size too large. Max size is 5MB.");
      }
      return file;
    });

    const photoUrls = await Promise.all(
      validatedFiles.map(async (file) => {
        const s3Params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `uploads/${Date.now()}_${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read",
        };

        const s3Response = await s3.upload(s3Params).promise();
        return s3Response.Location;
      })
    );

    res.json({ urls: photoUrls });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
    res.status(500).send("Error uploading to S3");
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const review = await Review.findById(id);

    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    if (review.user.toString() !== userId)
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });

    await Review.deleteOne({ _id: id });
    await User.findByIdAndUpdate(userId, { $pull: { reviews: id } });

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
