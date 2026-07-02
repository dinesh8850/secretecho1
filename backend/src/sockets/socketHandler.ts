import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

let io: SocketIOServer;

// Sets up Socket.io on top of our existing HTTP server.
export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // We'll lock this down to our real frontend URL in Step 19/21
    },
  });

  // This runs once per new client connection, BEFORE the connection is fully accepted.
  // We use it to verify the JWT sent by the client during connection.
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    try {
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as JwtPayload;
      socket.data.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId as string;

    // Each user gets their own "room" — only they receive events sent to it.
    socket.join(userId);

    console.log(`🔌 Socket connected for user ${userId}`);

    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected for user ${userId}`);
    });
  });

  return io;
};

// Lets other files (like messageService) emit events without
// needing to import socket.io directly everywhere.
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
