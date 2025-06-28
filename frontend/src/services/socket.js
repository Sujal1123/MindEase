import { io } from 'socket.io-client';

const socket = io('https://mindease-production-ed22.up.railway.app', {
  transports: ['websocket'], // avoid long-polling fallback
  withCredentials: true, // important for CORS handling
});

socket.on('connect', () => {
  console.log('✅ Socket connected to server:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('❌ Socket connection error:', err.message);
});

export default socket;
