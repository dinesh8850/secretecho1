import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as messageService from "../services/messageService";

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      res.status(400).json({ message: "Message text is required" });
      return;
    }

    if (!req.userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const { userMessage, aiMessage } = await messageService.sendMessage(
      req.userId,
      text.trim()
    );

    res.status(201).json({ userMessage, aiMessage });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send message";
    res.status(500).json({ message });
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const messages = await messageService.getChatHistory(req.userId);

    res.status(200).json({ messages });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch chat history";
    res.status(500).json({ message });
  }
};
