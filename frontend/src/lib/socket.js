/**
 * CampNexus – Socket.io client singleton
 *
 * Usage:
 *   import { getSocket, disconnectSocket } from "@/lib/socket";
 *   const socket = getSocket(userId);   // connects (or returns existing)
 *   socket.on("moderation-data", handler);
 *   disconnectSocket();                 // call on logout
 */

import { io } from "socket.io-client";

let socket = null;

/**
 * Returns the existing socket, or creates a new connection for `userId`.
 * Calling again with the same userId is a no-op.
 */
export function getSocket(userId) {
  if (!userId) return null;

  if (socket && socket.connected) return socket;

  // Disconnect stale socket if it exists but is disconnected
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io("http://localhost:5000", {
    query: { userId },
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    console.log("[Socket] connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.warn("[Socket] connection error:", err.message);
  });

  return socket;
}

/**
 * Tear down the socket connection (call on logout).
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("[Socket] manually disconnected");
  }
}
