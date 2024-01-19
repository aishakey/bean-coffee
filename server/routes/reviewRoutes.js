import express from "express";
import { body } from "express-validator";
import multer from "multer";
import {
  createReview,
  deleteReview,
  getUserReviews,
  uploadPhotos,
  checkCoffeeshopExistence,
} from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", authMiddleware, getUserReviews);

router.get("/exists", authMiddleware, checkCoffeeshopExistence);

router.post(
  "/",
  authMiddleware,
  [
    body("coffeeShopDetails.name")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Coffee Shop Name is required"),
    body("reviewContent.title")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Review Title is required"),
    body("reviewContent.wifiSpeed")
      .not()
      .isEmpty()
      .withMessage("WiFi Speed is required"),
    body("reviewContent.seating")
      .not()
      .isEmpty()
      .withMessage("Seating info is required"),
    body("reviewContent.vibe")
      .not()
      .isEmpty()
      .withMessage("Vibe info is required"),
    body("reviewContent.food")
      .not()
      .isEmpty()
      .withMessage("Food info is required"),
    body("reviewContent.drink")
      .not()
      .isEmpty()
      .withMessage("Drink info is required"),
    body("reviewContent.noisy")
      .not()
      .isEmpty()
      .withMessage("Noise level info is required"),
    body("reviewContent.additionalComments")
      .trim()
      .optional()
      .isLength({ max: 500 })
      .withMessage("Additional comments should not exceed 500 characters"),
  ],
  createReview
);

router.post("/upload", authMiddleware, upload.array("photos", 5), uploadPhotos);

router.delete("/:id", authMiddleware, deleteReview);

export default router;
