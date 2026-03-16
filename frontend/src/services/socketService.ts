import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  connect: (token: string) => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,

  connect: (token: string) => {
    const existingSocket = get().socket;
    if (existingSocket) return;

    // Connect to base URL (not /api) for sockets
    const socketUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '');
    
    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    set({ socket: newSocket });
  },

  disconnect: () => {
    const existingSocket = get().socket;
    if (existingSocket) {
      existingSocket.disconnect();
      set({ socket: null });
    }
  },
}));
