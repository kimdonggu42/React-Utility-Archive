import { useState, useEffect, useRef } from 'react';

export default function WebSocketPage() {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('');

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // WebSocket 서버에 연결
    const socket = new WebSocket('ws://localhost:8080');
    socketRef.current = socket;

    // WebSocket 연결 시
    socket.onopen = () => {
      setConnectionStatus('Connected');
      console.log('WebSocket 서버에 연결되었습니다');
    };

    // 서버로부터 메시지를 받았을 때
    socket.onmessage = (e) => {
      setMessages((prevMessages) => [...prevMessages, e.data]);
    };

    // WebSocket 에러 발생 시
    socket.onerror = (e) => {
      console.error('WebSocket 에러:', e);
    };

    // WebSocket 연결 종료 시
    socket.onclose = () => {
      setConnectionStatus('Disconnected');
      console.log('WebSocket 서버와의 연결이 종료되었습니다');
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
      socket.close();
    };
  }, []);

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (connectionStatus === 'Connected' && socketRef.current) {
      socketRef.current.send(message); // 서버로 메시지 전송
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
      <input className='border border-black' value={message} onChange={handleMessageInput} />
      <button onClick={handleSendMessage}>전송</button>
    </div>
  );
}
