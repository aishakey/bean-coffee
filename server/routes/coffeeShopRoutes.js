import express from "express";
import {
  getCoffeeShops,
  getCoffeeShop,
} from "../controllers/coffeeShopController.js";

const router = express.Router();

router.get("/", getCoffeeShops);

router.get("/:id", getCoffeeShop);

export default router;
