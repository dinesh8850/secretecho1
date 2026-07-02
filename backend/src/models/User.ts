import mongoose, { Schema, Document } from "mongoose";

// This interface describes the shape of a User document in TypeScript.
// It lets us get autocomplete and type-checking anywhere we use a User.
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
