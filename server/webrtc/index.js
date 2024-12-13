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
  socket.on('join_room', (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit('join_room');
  });

  socket.on('start_stream', (roomName) => socket.to(roomName).emit('start_stream'));

  socket.on('offer', (offer, roomName) => socket.to(roomName).emit('offer', offer));
});

server.listen(port, () => console.log(`WebRtc server is running on port ${port}`));
