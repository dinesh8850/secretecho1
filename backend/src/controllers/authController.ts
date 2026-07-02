import { Request, Response } from "express";
import * as authService from "../services/authService";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const { user, token } = await authService.signup(email, password);

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";
    res.status(400).json({ message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const { user, token } = await authService.login(email, password);

    res.status(200).json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    res.status(401).json({ message });
  }
};
