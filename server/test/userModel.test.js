import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config({ path: ".env.test" });

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
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

describe("User Model Test", () => {
  it("create & save user successfully", async () => {
    const userData = {
      name: "Test",
      username: "testuser",
      email: "test@test.com",
      password: "Testing123!",
    };
    const validUser = new User(userData);
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
  });

  it("should not save user with missing required fields", async () => {
    const userWithoutName = new User({
      username: "user",
      email: "test@test.com",
      password: "Testing123!",
    });
    let err;
    try {
      await userWithoutName.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it("should reject duplicate username", async () => {
    const userData = {
      name: "Test",
      username: "user",
      email: "test@test.com",
      password: "Testing123!",
    };
    const user1 = new User(userData);
    await user1.save();

    userData.email = "newemail@test.com";
    const user2 = new User(userData);
    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000);
  });

  it("should reject duplicate email", async () => {
    const userData = {
      name: "Test",
      username: "user",
      email: "test@test.com",
      password: "Testing123!",
    };
    const user1 = new User(userData);
    await user1.save();

    userData.username = "newusername";
    const user2 = new User(userData);
    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000);
  });

  it("should reject invalid email format", async () => {
    const userData = {
      name: "Test",
      username: "user",
      email: "invalidemail",
      password: "Testing123!",
    };
    const user = new User(userData);
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });

  it("should enforce username length constraints", async () => {
    const userData = {
      name: "Test",
      username: "us",
      email: "test@test.com",
      password: "Testing123!",
    };
    const user = new User(userData);
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.username).toBeDefined();
  });

  it("should enforce password length constraints", async () => {
    const userData = {
      name: "Test",
      username: "user",
      email: "test@test.com",
      password: "short",
    };
    const user = new User(userData);
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.password).toBeDefined();
  });
});
