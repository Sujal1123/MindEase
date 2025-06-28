import { io } from 'socket.io-client';

const socket = io('http://mindease.railway.internal');

socket.on('connect', () => {
  console.log('Socket connected to server:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err);
});

export default socket;
