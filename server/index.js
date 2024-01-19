import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import coffeeShopRoutes from "./routes/coffeeShopRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Coffee Shop Review (Bean) API!");
});

app.use("/api/users", userRoutes);
app.use("/api/coffeeShops", coffeeShopRoutes);
app.use("/api/reviews", reviewRoutes);

export default app;
