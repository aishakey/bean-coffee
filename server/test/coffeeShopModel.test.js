import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import CoffeeShop from "../models/CoffeeShop";

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
  await CoffeeShop.deleteMany({});
});

describe("CoffeeShop Model Test", () => {
  it("should create & save a coffee shop successfully", async () => {
    const validCoffeeShop = new CoffeeShop({
      name: "Test Coffee Shop",
      location: "123 Test Street",
      mainPhoto: "image.jpg",
    });
    const savedCoffeeShop = await validCoffeeShop.save();

    expect(savedCoffeeShop._id).toBeDefined();
    expect(savedCoffeeShop.name).toBe("Test Coffee Shop");
    expect(savedCoffeeShop.location).toBe("123 Test Street");
    expect(savedCoffeeShop.mainPhoto).toBe("image.jpg");
  });

  it("should not save coffee shop without a name", async () => {
    const coffeeShopWithoutName = new CoffeeShop({
      location: "123 Test Street",
      mainPhoto: "image.jpg",
    });
    let err;
    try {
      await coffeeShopWithoutName.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });

  it("should not save coffee shop without location", async () => {
    const coffeeShopWithoutLocation = new CoffeeShop({
      name: "Test Coffee Shop",
      mainPhoto: "image.jpg",
    });
    let err;
    try {
      await coffeeShopWithoutLocation.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.location).toBeDefined();
  });

  it("should not save coffee shop without mainPhoto", async () => {
    const coffeeShopWithoutPhoto = new CoffeeShop({
      name: "Test Coffee Shop",
      location: "123 Test Street",
    });
    let err;
    try {
      await coffeeShopWithoutPhoto.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.mainPhoto).toBeDefined();
  });
});
