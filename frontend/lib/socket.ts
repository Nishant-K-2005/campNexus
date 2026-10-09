import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const connectSocket = (userId: string): Socket => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(API_BASE_URL, {
    query: { userId },
    transports: ['websocket', 'polling'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('Socket.io connected for user:', userId);
  });

  socket.on('disconnect', () => {
    console.log('Socket.io disconnected');
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
