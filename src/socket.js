import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_HOST

export const socket = io(URL);