import { useState, useEffect, useRef } from 'react';

enum ConnectionStatus {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  ERROR = 'Error',
}

enum MessageType {
  NICKNAME = 'nickname',
  NEW_MESSAGE = 'new_message',
}

const serializedMessage = (type: string, payload: string) => {
  const msg = { type, payload };
  // object를 string으로 변환
  // 백엔드에서 javascript를 사용하지 않는 서버일 수 있으므로(ex: java)
  // 객체를 JSON 포맷의 문자열로 변환하여 서버로 전송한다.
  return JSON.stringify(msg);
};

export default function WebSocketDemo() {
  const [nickname, setNickname] = useState<string>('');
  const [isSettingNickname, setIsSettingNickname] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('');

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // WebSocket 서버에 연결 요청
    const socket = new WebSocket('ws://localhost:8080');
    socketRef.current = socket;

    // WebSocket 연결 시
    socket.onopen = () => {
      setConnectionStatus(ConnectionStatus.CONNECTED);
      console.log('✅Connected to Server');
    };

    // 서버로부터 메시지(다른 사람의 메시지)를 받았을 때
    socket.onmessage = (e) => setMessages((prevMessages) => [...prevMessages, e.data]);

    // WebSocket 에러 발생 시
    socket.onerror = (e) => {
      setConnectionStatus(ConnectionStatus.ERROR);
      console.error('Server Error:', e);
    };

    // WebSocket 연결 종료 시
    socket.onclose = () => {
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      console.log('❌Disconnected to Server');
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
      socket.close();
    };
  }, []);

  const handleNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendNickname = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSettingNickname) {
      setIsSettingNickname(false);
    } else if (socketRef.current && nickname.trim()) {
      socketRef.current.send(serializedMessage(MessageType.NICKNAME, nickname));
      setIsSettingNickname(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socketRef.current && message.trim()) {
      socketRef.current.send(serializedMessage(MessageType.NEW_MESSAGE, message));
      setMessage('');
    }
  };

  return (
    <div>
      <h2>WebSocket 연결 상태: {connectionStatus}</h2>
      <div>
        <h3>받은 메시지:</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSendNickname}>
        <input
          className='border border-black'
          placeholder='nickname'
          type='text'
          disabled={isSettingNickname}
          value={nickname}
          onChange={handleNicknameInput}
        />
        <button type='submit'>{isSettingNickname ? '재설정' : '설정'}</button>
      </form>
      <form onSubmit={handleSendMessage}>
        <input
          className='border border-black'
          type='text'
          placeholder='message'
          value={message}
          onChange={handleMessageInput}
        />
        <button type='submit'>전송</button>
      </form>
    </div>
  );
}
