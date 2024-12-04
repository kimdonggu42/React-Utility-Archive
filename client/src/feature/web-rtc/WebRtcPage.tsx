import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

enum ConnectionStatus {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  ERROR = 'Error',
}

export default function WebRtcPage() {
  const [roomName, setRoomName] = useState<string>('');
  const [isRoomJoin, setIsRoomJoin] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('');
  const [isSettingNickname, setIsSettingNickname] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // socket.io는 백엔드 연결이 끊어지면 자동으로 재연결을 시도한다.
    const socket = io('http://localhost:8080');
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus(ConnectionStatus.CONNECTED);
      console.log('✅Connected to Server');
    });

    socket.on('connect_error', (e) => {
      setConnectionStatus(ConnectionStatus.ERROR);
      console.error('Server Error:', e);
    });

    socket.on('disconnect', () => {
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      console.log('❌Disconnected to Server');
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('welcome', (user) =>
        setMessages((prevMessages) => [...prevMessages, `${user} joined`]),
      );

      socketRef.current.on('bye', (left) =>
        setMessages((prevMessages) => [...prevMessages, `${left} left`]),
      );

      socketRef.current.on('new_message', (msg) =>
        setMessages((prevMessages) => [...prevMessages, msg]),
      );
    }
  }, []);

  const handleRoomNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleRoomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socketRef.current && roomName.trim()) {
      socketRef.current.emit('enter_room', roomName);
      setIsRoomJoin(true);
    }
  };

  const handleSendNickname = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSettingNickname) {
      setIsSettingNickname(false);
    } else if (socketRef.current && nickname.trim()) {
      socketRef.current.emit('nickname', nickname);
      setIsSettingNickname(true);
    }
  };

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socketRef.current && message.trim()) {
      socketRef.current.emit('new_message', message, roomName, () =>
        setMessages((prevMessages) => [...prevMessages, `You: ${message}`]),
      );
      setMessage('');
    }
  };

  return (
    <div>
      {isRoomJoin ? (
        <div>
          <p>{roomName}</p>
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
        </div>
      ) : (
        <form onSubmit={handleRoomSubmit}>
          <input
            className='border border-black'
            type='text'
            placeholder='room name'
            value={roomName}
            onChange={handleRoomNameInput}
          />
          <button type='submit'>Enter room</button>
        </form>
      )}
    </div>
  );
}
