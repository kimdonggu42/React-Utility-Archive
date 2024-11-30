import http from 'http';
import express from 'express';
import { WebSocketServer } from 'ws';
import { Buffer } from 'buffer';

const app = express();
const port = 8080;

// 같은 서버에서 http, webSocket 둘 다 작동(http 서버 위에 ws 서버를 생성하여 http protocol과 ws connection 지원)
// localhost는 동일한 포트에서 http, webSocket request를 모두 처리할 수 있게 된다.
const server = http.createServer(app); // http 서버
const wss = new WebSocketServer({ server }); // webSocket 서버

const browsers = []; // 연결된 소켓(접속해 있는 사용자, 브라우저) 배열

wss.on('connection', (socket) => {
  console.log('✅Connected to Browser');

  browsers.push(socket);
  // 클라이언트에서 닉네임을 설정하지 않을 경우 기본적으로 익명으로 설정(socket안에 정보 저장)
  socket.nickname = 'Anonymous';

  socket.on('message', (data) => {
    // 버퍼를 UTF-8 문자열로 디코딩
    const message = data instanceof Buffer ? data.toString('utf8') : data;
    // string을 object로 변경
    // JSON 포맷의 문자열을 객체로 변환하여 클라이언트로 전송한다.
    const deserializedMessage = JSON.parse(message);

    switch (deserializedMessage.type) {
      case 'nickname':
        socket.nickname = deserializedMessage.payload;
        break;
      case 'new_message':
        // 연결된 모든 소켓(접속해 있는 사용자, 브라우저)들에 접근하여 메시지 전송
        browsers.forEach((browser) => {
          browser.send(
            `${browser === socket ? `${socket.nickname}(You)` : `${socket.nickname}`}: ${
              deserializedMessage.payload
            }`,
          );
        });
        break;
    }
  });

  socket.on('close', () => {
    console.log('❌Disconnected to Browser');

    // 연결이 끊어진 브라우저는 배열에서 제거
    const index = browsers.indexOf(socket);
    if (index !== -1) browsers.splice(index, 1);
  });
});

server.listen(port, () => {
  console.log('WebSocket server is running on port 8080');
});
