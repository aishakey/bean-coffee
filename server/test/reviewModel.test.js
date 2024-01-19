import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Review from "../models/Review";
import CoffeeShop from "../models/CoffeeShop";
import User from "../models/User";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Review.deleteMany({});
  await CoffeeShop.deleteMany({});
  await User.deleteMany({});
});

describe("Review Model Test", () => {
  let coffeeShopId, userId;

  beforeEach(async () => {
    const coffeeShop = new CoffeeShop({
      name: "Test Coffee Shop",
      location: "123 Test Street",
      mainPhoto: "photo.jpg",
    });
    const savedCoffeeShop = await coffeeShop.save();
    coffeeShopId = savedCoffeeShop._id;

    const user = new User({
      name: "John Doe",
      username: "john_doe",
      email: "johndoe@example.com",
      password: "Password123!",
    });
    const savedUser = await user.save();
    userId = savedUser._id;
  });

  it("should create & save a review successfully", async () => {
    const reviewData = {
      coffeeShop: coffeeShopId,
      user: userId,
      title: "Great place!",
      wifiSpeed: "Fast",
      seating: "Just okay",
      vibe: "Local",
      food: "Snacks",
      drink: "Great",
      noisy: "Loud",
    };

    const review = new Review(reviewData);
    const savedReview = await review.save();

    expect(savedReview._id).toBeDefined();
    expect(savedReview.coffeeShop.toString()).toBe(coffeeShopId.toString());
    expect(savedReview.user.toString()).toBe(userId.toString());
    expect(savedReview.title).toBe("Great place!");
    expect(savedReview.wifiSpeed).toBe("Fast");
    expect(savedReview.seating).toBe("Just okay");
    expect(savedReview.vibe).toBe("Local");
    expect(savedReview.food).toBe("Snacks");
    expect(savedReview.drink).toBe("Great");
    expect(savedReview.noisy).toBe("Loud");
  });

  const requiredFields = [
    "coffeeShop",
    "user",
    "title",
    "wifiSpeed",
    "seating",
    "vibe",
    "food",
    "drink",
    "noisy",
  ];
  requiredFields.forEach((field) => {
    it(`should not save review without ${field}`, async () => {
      const reviewData = {
        coffeeShop: coffeeShopId,
        user: userId,
        title: "Missing field test",
        wifiSpeed: "Fast",
        seating: "Just okay",
        vibe: "Local",
        food: "Snacks",
        drink: "Great",
        noisy: "Loud",
      };

      reviewData[field] = undefined;
      let err;
      try {
        await new Review(reviewData).save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors[field]).toBeDefined();
    });
  });

  it("should save review with optional fields", async () => {
    const reviewData = {
      coffeeShop: coffeeShopId,
      user: userId,
      title: "Optional fields test",
      wifiSpeed: "Fast",
      seating: "Just okay",
      vibe: "Local",
      food: "Snacks",
      drink: "Great",
      noisy: "Loud",
      additionalComments: "Lovely atmosphere!",
      photos: ["photo1.jpg", "photo2.jpg"],
    };

    const review = new Review(reviewData);
    const savedReview = await review.save();

    expect(savedReview.additionalComments).toBe("Lovely atmosphere!");
    expect(savedReview.photos).toEqual(
      expect.arrayContaining(["photo1.jpg", "photo2.jpg"])
    );
  });
});
