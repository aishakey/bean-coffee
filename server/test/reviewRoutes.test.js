import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../index.js";
import Review from "../models/Review";
import CoffeeShop from "../models/CoffeeShop";
import User from "../models/User";

dotenv.config({ path: ".env.test" });

let mongoServer, mockUser, mockCoffeeShop, token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const hashedPassword = await bcrypt.hash("Securepassword123!", 12);
  mockUser = await User.create({
    name: "John Doe",
    username: "johndoe",
    email: "johndoe@example.com",
    password: hashedPassword,
  });

  mockCoffeeShop = await CoffeeShop.create({
    name: "CoffeeShop",
    location: "New York",
    mainPhoto: "coffeeshop.jpeg",
  });

  token = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Review.deleteMany({});
  await CoffeeShop.deleteMany({});

  mockCoffeeShop = await CoffeeShop.create({
    name: "Test Coffee Shop",
    location: "New York",
    mainPhoto: "test_photo.jpg",
  });
});

describe("Review Routes", () => {
  it("should successfully create a review", async () => {
    const reviewData = {
      userId: mockUser._id,
      coffeeShopDetails: {
        name: mockCoffeeShop.name,
        location: mockCoffeeShop.location,
      },
      reviewContent: {
        title: "Test",
        wifiSpeed: "Fast",
        seating: "Just okay",
        vibe: "Local",
        food: "Snacks",
        drink: "Great",
        noisy: "Loud",
      },
      photoUrls: ["http://example.com/photo.jpg"],
    };

    const response = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send(reviewData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe(reviewData.reviewContent.title);
    expect(response.body.wifiSpeed).toBe(reviewData.reviewContent.wifiSpeed);
    expect(response.body.seating).toBe(reviewData.reviewContent.seating);
    expect(response.body.vibe).toBe(reviewData.reviewContent.vibe);
    expect(response.body.food).toBe(reviewData.reviewContent.food);
    expect(response.body.drink).toBe(reviewData.reviewContent.drink);
    expect(response.body.noisy).toBe(reviewData.reviewContent.noisy);
  });

  it("should successfully delete a review", async () => {
    const review = await Review.create({
      coffeeShop: mockCoffeeShop._id,
      user: mockUser._id,
      title: "Great Experience",
      wifiSpeed: "Fast",
      seating: "Just okay",
      vibe: "Local",
      food: "Snacks",
      drink: "Great",
      noisy: "Loud",
      additionalComments: "Would visit again!",
      photos: [
        "http://example.com/photo1.jpg",
        "http://example.com/photo2.jpg",
      ],
    });

    const response = await request(app)
      .delete(`/api/reviews/${review._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: mockUser._id });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Review deleted successfully"
    );
  });

  it("should retrieve user reviews", async () => {
    await Review.create({
      coffeeShop: mockCoffeeShop._id,
      user: mockUser._id,
      title: "Great Experience",
      wifiSpeed: "Fast",
      seating: "Just okay",
      vibe: "Local",
      food: "Snacks",
      drink: "Great",
      noisy: "Loud",
      additionalComments: "Would visit again!",
      photos: [
        "http://example.com/photo1.jpg",
        "http://example.com/photo2.jpg",
      ],
    });

    const response = await request(app)
      .get("/api/reviews")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("should check coffee shop existence", async () => {
    const response = await request(app)
      .get(
        `/api/reviews/exists?location=${encodeURIComponent(
          mockCoffeeShop.location
        )}`
      )
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("exists", true);
  });
});
