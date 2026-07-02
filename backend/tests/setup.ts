import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const TEST_DB_URI = process.env.MONGO_URI?.replace(
  "/secretecho?",
  "/secretecho_test?"
) as string;

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
