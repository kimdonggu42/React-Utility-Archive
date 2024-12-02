import { io } from 'socket.io-client';

export default function WebRtcPage() {
  const socket = io('http://localhost:8080');

  console.log(socket);

  return <></>;
}
