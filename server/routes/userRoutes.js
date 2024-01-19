import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().not().isEmpty().withMessage("Name is required"),

    body("username")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters"),

    body("email")
      .isEmail()
      .withMessage("Invalid email address")
      .normalizeEmail(),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  register
);
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email address")
      .normalizeEmail(),

    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  login
);
router.get("/:userId", getUserProfile);

export default router;
