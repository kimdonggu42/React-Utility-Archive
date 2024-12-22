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

// 클라이언트로 방 인원 수를 전송하는 함수
const sendRoomMemberCount = (roomName) => {
  const room = io.sockets.adapter.rooms.get(roomName); // 방 정보 가져오기
  const memberCount = room ? room.size : 0; // 방에 연결된 소켓 수
  io.to(roomName).emit('room_member_count', memberCount); // 방에 인원 수 전송
};

io.on('connection', (socket) => {
  socket.on('join_room', (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit('join_room');
    sendRoomMemberCount(roomName); // 방 인원 수 업데이트
  });

  socket.on('start_stream', (roomName) => socket.to(roomName).emit('start_stream'));

  socket.on('offer', (offer, roomName) => socket.to(roomName).emit('offer', offer));

  socket.on('answer', (answer, roomName) => socket.to(roomName).emit('answer', answer));

  socket.on('ice', (ice, roomName) => socket.to(roomName).emit('ice', ice));

  // disconnecting
  // 소켓이 방을 떠나기 직전에 발생한다.
  // 이 이벤트 시점에서는 소켓이 여전히 방에 포함되어 있기 때문에, 방 나가기와 관련된 작업을 수행할 수 있다.
  // 이 시점에서는 방 목록에 여전히 해당 소켓이 존재한다.

  // disconnect
  // 소켓이 방을 떠난 이후에 발생한다.
  // 소켓은 이미 방에서 제거된 상태이므로, 방과 관련된 작업을 수행하려 할 때 정보가 더 이상 유효하지 않을 수 있다.
  // 특히 socket.rooms는 이 시점에서 비어 있을 수 있다.

  // 클라이언트가 방에서 나갈 때 이벤트 처리
  socket.on('disconnecting', () => {
    // Socket.IO는 모든 소켓을 자동으로 하나의 기본 방에 추가하는데, 이 방의 이름은 소켓의 고유 id다.
    // 예를 들어, 소켓의 id가 abc123이라면 기본적으로 이 소켓은 abc123이라는 이름의 방에 속해 있다.
    // 기본 방은 소켓 고유의 id로 생성되므로, 이 방을 제외하고 사용자가 실제로 참가한 방만 필터링 한다.
    // 소켓 고유의 기본 방(자신의 id로 생성된 방)을 제외한 실제 참여 중인 방만 필터링한다.
    const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id); // 소켓이 참가한 방 목록
    rooms.forEach((roomName) => {
      socket.leave(roomName); // 소켓을 명시적으로 방에서 제거
      socket.to(roomName).emit('leave_room'); // 다른 사용자에게 방 나가기 알림
      sendRoomMemberCount(roomName); // 방 인원 수 업데이트
    });
  });
});

server.listen(port, () => console.log(`WebRtc server is running on port ${port}`));
