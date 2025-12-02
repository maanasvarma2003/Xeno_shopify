import { io } from 'socket.io-client';

const URL = 'http://localhost:3000'; // Adjust if deployed

export const socket = io(URL, {
    autoConnect: true,
    transports: ['websocket']
});
