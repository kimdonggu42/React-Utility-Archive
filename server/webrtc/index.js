import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
const port = 8080;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
  },
});

io.on('connection', (socket) => {
  console.log('✅Connected to Browser');
  console.log(socket);
});

server.listen(port, () => {
  console.log(`WebRtc server is running on port ${port}`);
});
