import mongoose, { Schema, Document, Types } from "mongoose";

export type Sender = "user" | "ai";

export interface IMessage extends Document {
  userId: Types.ObjectId;
  sender: Sender;
  text: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  sender: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
