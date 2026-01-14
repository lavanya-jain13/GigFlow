import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  return socket;
};

export const initializeSocket = (userId: string): Socket => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    withCredentials: true,
  });

  // Register user when socket connects
  socket.on('connect', () => {
    console.log('Connected to socket server');
    socket?.emit('register', userId);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
