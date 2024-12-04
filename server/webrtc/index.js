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

  socket.nickname = 'Anonymous';

  socket.onAny((event) => console.log(`Socket Event: ${event}`));

  socket.on('enter_room', (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit('welcome', socket.nickname);
  });

  socket.on('disconnecting', () =>
    socket.rooms.forEach((room) => socket.to(room).emit('bye', socket.nickname)),
  );

  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
    done(); // 이 done 함수는 백엔드에서 실행되는게 아닌 done을 호출했을 때 프론트엔드에서 실행된다.
  });

  socket.on('nickname', (nickname) => (socket.nickname = nickname));
});

server.listen(port, () => {
  console.log(`WebRtc server is running on port ${port}`);
});
