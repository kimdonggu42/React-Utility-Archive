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

const publicRooms = () => {
  // adapter는 기본적으로 다른(분리되어 있는) 서버들 사이에서 실시간 어플리케이션을 동기화 하는 것이다.
  const { sids, rooms } = io.sockets.adapter;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) publicRooms.push(key);
  });
  return publicRooms;
};

const countRooms = (roomName) => {
  return io.sockets.adapter.rooms.get(roomName)?.size;
};

io.on('connection', (socket) => {
  console.log('✅Connected to Browser');

  socket.nickname = 'Anonymous';

  socket.onAny((event) => console.log(`Socket Event: ${event}`));

  socket.on('enter_room', (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit('welcome', socket.nickname, countRooms(roomName));
    io.sockets.emit('room_change', publicRooms());
  });

  // disconnecting 이벤트는 방을 떠나기 직전에 발생한다.
  socket.on('disconnecting', () =>
    socket.rooms.forEach((room) =>
      socket.to(room).emit('bye', socket.nickname, countRooms(room) - 1),
    ),
  );

  socket.on('disconnect', () => io.sockets.emit('room_change', publicRooms()));

  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
    done(); // 이 done 함수는 백엔드에서 실행되는게 아닌 done을 호출했을 때 프론트엔드에서 실행된다.
  });

  socket.on('nickname', (nickname) => (socket.nickname = nickname));
});

server.listen(port, () => {
  console.log(`WebRtc server is running on port ${port}`);
});
