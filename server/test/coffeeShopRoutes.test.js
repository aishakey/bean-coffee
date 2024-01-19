import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../index.js";
import CoffeeShop from "../models/CoffeeShop.js";
import Review from "../models/Review";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await CoffeeShop.deleteMany({});
});

describe("CoffeeShop Routes", () => {
  it("should retrieve all coffee shops", async () => {
    await CoffeeShop.create({
      name: "Coffee Shop 1",
      location: "Here",
      mainPhoto: "photo1.jpeg",
    });
    await CoffeeShop.create({
      name: "Coffee Shop 2",
      location: "There",
      mainPhoto: "photo2.jpeg",
    });

    const response = await request(app).get("/api/coffeeshops");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[1]).toHaveProperty("location");
  });

  it("should retrieve a single coffee shop by ID", async () => {
    const coffeeShop = new CoffeeShop({
      name: "Unique Coffee Shop",
      location: "City Center",
      mainPhoto: "uniquephoto.jpg",
    });
    await coffeeShop.save();

    const response = await request(app).get(
      `/api/coffeeshops/${coffeeShop._id}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", coffeeShop._id.toString());
    expect(response.body).toHaveProperty("name", "Unique Coffee Shop");
  });

  it("should return 404 for a non-existent coffee shop ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(
      `/api/coffeeshops/${nonExistentId}`
    );
    expect(response.statusCode).toBe(404);
  });

  it("should filter coffee shops by location", async () => {
    await CoffeeShop.create({
      name: "Coffee Shop A",
      location: "Downtown",
      mainPhoto: "photoA.jpg",
    });
    await CoffeeShop.create({
      name: "Coffee Shop B",
      location: "Uptown",
      mainPhoto: "photoB.jpg",
    });

    const response = await request(app).get("/api/coffeeshops?location=uptown");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].location).toContain("Uptown");
  });

  it("should filter coffee shops by minimum number of reviews", async () => {
    const mockCoffeeShopId1 = new mongoose.Types.ObjectId();
    const mockCoffeeShopId2 = new mongoose.Types.ObjectId();
    const mockUserId = new mongoose.Types.ObjectId();
    const review1 = new Review({
      coffeeShop: mockCoffeeShopId1,
      user: mockUserId,
      title: "Test1",
      wifiSpeed: "Fast",
      seating: "Just okay",
      vibe: "Local",
      food: "Snacks",
      drink: "Great",
      noisy: "Loud",
    });
    const review2 = new Review({
      coffeeShop: mockCoffeeShopId2,
      user: mockUserId,
      title: "Test2",
      wifiSpeed: "Fast",
      seating: "Just okay",
      vibe: "Local",
      food: "Snacks",
      drink: "Great",
      noisy: "Loud",
    });
    await review1.save();
    await review2.save();

    await CoffeeShop.create({
      name: "Coffee Shop No Reviews",
      location: "Downtown",
      mainPhoto: "photoNoReviews.jpg",
      reviews: [],
    });

    const coffeeShopWithSomeReviews = await CoffeeShop.create({
      name: "Coffee Shop Some Reviews",
      location: "Uptown",
      mainPhoto: "photoSomeReviews.jpg",
      reviews: [review1, review2],
    });
    const minReviews = 2;

    const response = await request(app).get(
      `/api/coffeeshops?minReviews=${minReviews}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]._id.toString()).toBe(
      coffeeShopWithSomeReviews._id.toString()
    );
  });
});
