import Message, { IMessage } from "../models/Message";
import { generateReply } from "./aiService";
import { getIO } from "../sockets/socketHandler";

const emitToUser = (userId: string, event: string, data: unknown): void => {
  try {
    // getIO() throws if Socket.io isn't initialized (e.g. during tests).
    // We catch silently so message saving still works without a socket server.
    getIO().to(userId).emit(event, data);
  } catch {
    // Socket not available — safe to ignore in test environment
  }
};

export const sendMessage = async (
  userId: string,
  text: string
): Promise<{ userMessage: IMessage; aiMessage: IMessage }> => {
  const userMessage = await Message.create({
    userId,
    sender: "user",
    text,
  });

  emitToUser(userId, "new_message", userMessage);

  const aiReplyText = await generateReply(text);

  const aiMessage = await Message.create({
    userId,
    sender: "ai",
    text: aiReplyText,
  });

  emitToUser(userId, "new_message", aiMessage);

  return { userMessage, aiMessage };
};

export const getChatHistory = async (userId: string): Promise<IMessage[]> => {
  const messages = await Message.find({ userId }).sort({ createdAt: 1 });
  return messages;
};
