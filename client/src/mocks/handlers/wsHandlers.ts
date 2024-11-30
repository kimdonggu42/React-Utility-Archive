import { ws } from 'msw';

const chat = ws.link('ws://localhost:8080');

export const wsHandlers = [
  chat.addEventListener('connection', ({ client }) => {
    client.addEventListener('message', (e) => {
      // 연결된 모든 클라이언트에게 메시지 전송
      chat.broadcast(e.data);
    });
  }),
];
