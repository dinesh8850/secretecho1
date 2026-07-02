import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const SALT_ROUNDS = 10;

// Generates a signed JWT containing the user's ID.
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

export const signup = async (
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({ email, passwordHash });

  const token = generateToken(user._id.toString());

  return { user, token };
};

export const login = async (
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id.toString());

  return { user, token };
};
