import { io, Socket } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';

interface Constraints {
  audio: boolean;
  video: boolean;
}

interface InputDeviceInfo {
  deviceId: string;
  groupId: string;
  kind: string;
  label: string;
}

enum ConnectionStatus {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  ERROR = 'Error',
}

const constraints: Constraints = { audio: true, video: true };

// 구글 STUN 서버(STUN 서버는 공용 IP 주소를 알려주는 서버)
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};

export default function WebRTCPage() {
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isRoomJoin, setIsRoomJoin] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [chatMessage, setChatMessage] = useState<string>('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  useEffect(() => {
    // socket.io는 백엔드 연결이 끊어지면 자동으로 재연결을 시도한다.
    const socket = io('http://localhost:8080');
    socketRef.current = socket;

    socket.on('connect', () => setConnectionStatus(ConnectionStatus.CONNECTED));
    socket.on('connect_error', () => setConnectionStatus(ConnectionStatus.ERROR));
    socket.on('disconnect', () => setConnectionStatus(ConnectionStatus.DISCONNECTED));
    socket.on('join_room', () => console.log('someone joined'));

    // 시그널링 프로세스
    // 최초 내 브라우저(Peer A)에서 실행되는 코드
    socket.on('start_stream', async () => {
      try {
        if (peerConnectionRef.current) {
          // 데이터 채널 생성(WebSocket과는 다르게 서버를 거치지 않기 때문에 지연이 매우 낮고 효율적이다)
          const dataChannel = peerConnectionRef.current.createDataChannel('chat');
          dataChannelRef.current = dataChannel;

          dataChannel.onopen = () => console.log('DataChannel 열림 (Peer A)');
          dataChannel.onclose = () => console.log('DataChannel 닫힘 (Peer A)');

          // 메시지 수신 이벤트 핸들러 설정
          dataChannel.onmessage = (e) =>
            setReceivedMessages((prev) => [...prev, `상대방: ${e.data}`]);

          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          socket.emit('offer', offer, roomName);
        }
      } catch (err) {
        console.error(err);
      }
    });

    // 상대 브라우저(Peer B)에서 실행되는 코드
    socket.on('offer', async (offer) => {
      try {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.ondatachannel = (e) => {
            // 상대방의 DataChannel 수신
            const receiveChannel = e.channel;
            dataChannelRef.current = receiveChannel;

            receiveChannel.onopen = () => console.log('DataChannel 열림 (Peer B)');
            receiveChannel.onclose = () => console.log('DataChannel 닫힘 (Peer B)');

            receiveChannel.onmessage = (e) => {
              setReceivedMessages((prev) => [...prev, `상대방: ${e.data}`]);
            };
          };

          await peerConnectionRef.current.setRemoteDescription(offer);
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit('answer', answer, roomName);
        }
      } catch (err) {
        console.error('Offer 처리 중 에러 발생:', err);
      }
    });

    // 상대 브라우저(Peer B)에서 answer를 받은 후 내 브라우저(Peer A)에서 실행되는 코드
    socket.on('answer', async (answer) => {
      try {
        if (peerConnectionRef.current) await peerConnectionRef.current.setRemoteDescription(answer);
      } catch (err) {
        console.error('Answer 처리 중 에러 발생:', err);
      }
    });

    socket.on('ice', async (ice) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(ice);
        }
      } catch (err) {
        console.error('ICE Candidate 추가 중 에러 발생:', err);
      }
    });

    return () => {
      socket.close();
    };
  }, [roomName]);

  useEffect(() => {
    const getCameraList = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === 'videoinput');
        setCameraList(cameras);
        if (cameras.length > 0) setSelectedCameraId(cameras[0].deviceId);
      } catch (err) {
        console.error(err);
      }
    };
    getCameraList();
  }, []);

  const startStream = async (deviceId?: string) => {
    try {
      const constraintsWithDevice = {
        ...constraints,
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
      };

      if (mediaStreamRef.current) {
        const tracks = mediaStreamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraintsWithDevice);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;

      const peerConnection = new RTCPeerConnection(iceServers);

      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => peerConnection.addTrack(track, mediaStream));

      peerConnection.onicecandidate = (e) => {
        if (e.candidate && socketRef.current) socketRef.current.emit('ice', e.candidate, roomName);
      };

      peerConnection.ontrack = (e) => {
        if (peerVideoRef.current) peerVideoRef.current.srcObject = e.streams[0];
      };

      if (socketRef.current) socketRef.current.emit('start_stream', roomName);

      mediaStreamRef.current = mediaStream;
      peerConnectionRef.current = peerConnection;

      setIsCameraEnabled(true);
      setIsAudioMuted(true);
      setIsStreaming(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Offerer side
  const stopStream = () => {
    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setIsStreaming(false);
  };

  const handleCameraClick = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => (track.enabled = !track.enabled));
      setIsCameraEnabled((prev) => !prev);
    }
  };

  const handleMuteClick = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !track.enabled));
      setIsAudioMuted((prev) => !prev);
    }
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCameraId(e.target.value);
    startStream(e.target.value);
  };

  const handleRoomNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleRoomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socketRef.current && roomName.trim()) {
      socketRef.current.emit('join_room', roomName, () => setIsRoomJoin(true));
    }
  };

  const sendMessage = () => {
    if (dataChannelRef.current && chatMessage.trim()) {
      dataChannelRef.current.send(chatMessage);
      setReceivedMessages((prev) => [...prev, `나: ${chatMessage}`]);
      setChatMessage('');
    }
  };

  return (
    <div>
      {isRoomJoin ? (
        <div>
          <p>{roomName}</p>
          <h2>WebSocket 연결 상태: {connectionStatus}</h2>
          <div>
            <p>나</p>
            <video playsInline autoPlay width='400' height='400' ref={videoRef} />
          </div>
          <div>
            <p>상대방</p>
            <video playsInline autoPlay width='400' height='400' ref={peerVideoRef} />
          </div>
          <button onClick={isStreaming ? stopStream : () => startStream(selectedCameraId)}>
            {isStreaming ? 'Stop' : 'Start'}
          </button>
          <div>
            <h3>채팅</h3>
            <div className='h-[100px] overflow-y-auto border border-black'>
              {receivedMessages.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
            <div>
              <input
                type='text'
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder='메시지를 입력하세요...'
                style={{ marginRight: '10px' }}
              />
              <button onClick={sendMessage}>전송</button>
            </div>
          </div>
          {isStreaming && (
            <>
              <select value={selectedCameraId} onChange={handleCameraChange}>
                {cameraList.map((value) => (
                  <option key={value.deviceId} value={value.deviceId}>
                    {value.label}
                  </option>
                ))}
              </select>
              <button onClick={handleCameraClick}>
                {isCameraEnabled ? 'Camera Off' : 'Camera On'}
              </button>
              <button onClick={handleMuteClick}>{isAudioMuted ? 'Mute' : 'Unmute'}</button>
            </>
          )}
        </div>
      ) : (
        <div>
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
        </div>
      )}
    </div>
  );
}
