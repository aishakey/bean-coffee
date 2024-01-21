import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import coffeeShopRoutes from "./routes/coffeeShopRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "https://bean-coffeeshop-finder.netlify.app",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Coffee Shop Review (Bean) API!");
});

app.use("/api/users", userRoutes);
app.use("/api/coffeeShops", coffeeShopRoutes);
app.use("/api/reviews", reviewRoutes);

export default app;
