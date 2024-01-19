import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../index.js";
import User from "../models/User";

dotenv.config({ path: ".env.test" });

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
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

describe("User Routes", () => {
  it("should register a new user", async () => {
    const userData = {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "Testing123!",
    };

    const response = await request(app)
      .post("/api/users/register")
      .send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  it("should not allow duplicate registration with the same email", async () => {
    const userData = {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "Testing123!",
    };

    await request(app).post("/api/users/register").send(userData);

    const response = await request(app)
      .post("/api/users/register")
      .send(userData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "User already exists");
  });

  it("should not allow registration with invalid input data", async () => {
    // Test case 1: Missing name
    const userDataMissingName = {
      username: "testuser",
      email: "test@example.com",
      password: "Testing123!",
    };
    const response1 = await request(app)
      .post("/api/users/register")
      .send(userDataMissingName);
    console.log(response1.body);
    expect(response1.statusCode).toBe(400);
    expect(response1.body).toHaveProperty("errors");
    expect(response1.body.errors).toContainEqual({
      location: "body",
      msg: "Name is required",
      type: "field",
      value: "",
      path: "name",
    });

    // Test case 2: Invalid username format (less than 3 characters)
    const userDataInvalidUsername = {
      name: "Test User",
      username: "us",
      email: "test@example.com",
      password: "Testing123!",
    };

    const response2 = await request(app)
      .post("/api/users/register")
      .send(userDataInvalidUsername);

    expect(response2.statusCode).toBe(400);
    expect(response2.body).toHaveProperty("errors");
    expect(response2.body.errors).toContainEqual({
      msg: "Username must be between 3 and 20 characters",
      location: "body",
      path: "username",
      type: "field",
      value: "us",
    });
    // Test case 3: Invalid email format
    const userDataInvalidEmail = {
      name: "Test User",
      username: "testuser",
      email: "invalidemail",
      password: "Testing123!",
    };

    const response3 = await request(app)
      .post("/api/users/register")
      .send(userDataInvalidEmail);

    expect(response3.statusCode).toBe(400);
    expect(response3.body).toHaveProperty("errors");
    expect(response3.body.errors).toContainEqual({
      msg: "Invalid email address",
      path: "email",
      location: "body",
      type: "field",
      value: "invalidemail",
    });

    // Test case 4: Short password
    const userDataShortPassword = {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "short",
    };

    const response4 = await request(app)
      .post("/api/users/register")
      .send(userDataShortPassword);

    expect(response4.statusCode).toBe(400);
    expect(response4.body).toHaveProperty("errors");
    expect(response4.body.errors).toContainEqual({
      msg: "Password must be at least 8 characters long",
      path: "password",
      location: "body",
      type: "field",
      value: "short",
    });
  });

  it("should allow a registered user to log in with correct credentials", async () => {
    const hashedPassword = await bcrypt.hash("Testing123!", 12);
    await User.create({
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
    });

    const loginData = {
      email: "test@example.com",
      password: "Testing123!",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(loginData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should reject user trying to log in with incorrect password", async () => {
    const hashedPassword = await bcrypt.hash("Testing123!", 12);
    await User.create({
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
    });

    const loginData = {
      email: "test@example.com",
      password: "WrongPassword1!",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(loginData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should reject login for a non-existent user", async () => {
    const loginData = {
      email: "nonexistent@example.com",
      password: "Testing123!",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(loginData);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should get user profile by ID", async () => {
    const userData = {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "Testing123!",
    };

    const response1 = await request(app)
      .post("/api/users/register")
      .send(userData);

    expect(response1.statusCode).toBe(201);
    expect(response1.body).toHaveProperty("token");

    const response2 = await request(app).get(
      `/api/users/${response1.body.result._id}`
    );

    expect(response2.statusCode).toBe(200);
    expect(response2.body).toHaveProperty("_id");
    expect(response2.body).toHaveProperty("name", "Test User");
    expect(response2.body).toHaveProperty("email", "test@example.com");
  });

  it("should return 404 for non-existent user profile", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/users/${nonExistentUserId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });
});
