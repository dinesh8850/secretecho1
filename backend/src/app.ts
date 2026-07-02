import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import messageRoutes from "./routes/messageRoutes";

const createApp = (): Application => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(express.json());

  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/messages", messageRoutes);

  return app;
};

export default createApp;
