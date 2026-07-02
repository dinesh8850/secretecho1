import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Use a separate test database so tests never touch real data
const TEST_DB_URI = process.env.MONGO_URI?.replace(
  "/secretecho?",
  "/secretecho_test?"
) as string;

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterAll(async () => {
  // Clean up all test data after the full suite runs
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Clear all collections between each test so tests don't affect each other
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
