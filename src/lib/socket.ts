import { io, type Socket } from 'socket.io-client';
import { getToken } from './api';

// Dev  : même origine que Vite → proxy WebSocket vers ws://localhost:3000
// Prod : VITE_API_URL (ex: 'https://api.monsite.com') ou fallback dynamique
const SOCKET_URL: string =
  (window as any).env?.VITE_API_URL ||
  import.meta.env.VITE_API_URL ||
  '';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: '/ws/chat',
      auth: { token: `Bearer ${getToken() ?? ''}` },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
