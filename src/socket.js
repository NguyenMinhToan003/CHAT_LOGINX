import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = 'https://loginx.onrender.com';
const URL = 'http://localhost:8123';

export const socket = io(URL);