"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "@/types/message";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

// A custom hook encapsulates related logic so any component can
// get a socket connection without knowing the implementation details.
export const useSocket = (
  token: string | null,
  onNewMessage: (message: Message) => void
) => {
  // useRef stores the socket instance without causing re-renders when it changes.
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("new_message", (message: Message) => {
      onNewMessage(message);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // Cleanup: disconnect when the component unmounts or token changes.
    // Without this, you'd accumulate stale connections every time the
    // component re-renders.
    return () => {
      socket.disconnect();
    };
  }, [token]);

  return socketRef;
};
