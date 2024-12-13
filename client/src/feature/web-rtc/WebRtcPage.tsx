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

export default function WebRTCPage() {
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isRoomJoin, setIsRoomJoin] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('');

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const myConnectionRef = useRef<RTCPeerConnection | null>(null);

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

    socket.on('join_room', () => console.log('someone joined'));

    // 시그널링 프로세스
    // 내 브라우저(Peer A)에서 실행되는 코드
    socket.on('start_stream', async () => {
      if (myConnectionRef.current) {
        // createOffer()는 Offer SDP를 생성한다. 이 Offer에는 로컬 피어의 미디어 설정 정보(비디오/오디오 트랙, 코덱, 네트워크 주소 등)가 포함된다.
        // setLocalDescription는 생성된 Offer SDP를 로컬 피어의 localDescription에 설정한다. 설정된 SDP는 시그널링 서버(WebSocket 등)를 통해 상대 피어에게 전송된다.
        const offer = await myConnectionRef.current.createOffer();
        myConnectionRef.current.setLocalDescription(offer);
        if (socketRef.current) {
          socketRef.current.emit('offer', offer, roomName);
          console.log('send the offer');
        }
      }
    });

    // 상대 브라우저(Peer B)에서 실행되는 코드
    socket.on('offer', (offer) => console.log(offer));

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
      }
      if (myConnectionRef.current) myConnectionRef.current.close();

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraintsWithDevice);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;

      const peerConnection = new RTCPeerConnection();
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => peerConnection.addTrack(track, mediaStream));

      mediaStreamRef.current = mediaStream;
      myConnectionRef.current = peerConnection;

      if (socketRef.current) socketRef.current.emit('start_stream', roomName);

      setIsStreaming(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopStream = () => {
    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (myConnectionRef.current) myConnectionRef.current.close();
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
    if (socketRef.current && roomName.trim())
      socketRef.current.emit('join_room', roomName, () => setIsRoomJoin(true));
  };

  return (
    <div>
      {isRoomJoin ? (
        <div>
          <p>{roomName}</p>
          <h2>WebSocket 연결 상태: {connectionStatus}</h2>
          <video playsInline autoPlay width='400' height='400' ref={videoRef} />
          <button onClick={isStreaming ? stopStream : () => startStream(selectedCameraId)}>
            {isStreaming ? 'Stop' : 'Start'}
          </button>
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
          <button onClick={handleMuteClick}>{isAudioMuted ? 'Unmute' : 'Mute'}</button>
        </div>
      ) : (
        <div>
          {/* <div>
            <h3>방 리스트:</h3>
            <ul>
              {rooms.map((room, index) => (
                <li key={index}>{room}</li>
              ))}
            </ul>
          </div> */}
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
