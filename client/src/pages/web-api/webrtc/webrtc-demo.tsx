import { io, Socket } from 'socket.io-client';
import { useState, useEffect, useRef, useCallback } from 'react';

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

// 실행 흐름
// 1. Peer A는 getUserMedia()를 호출해 로컬 오디오/비디오 스트림을 설정하고, RTCPeerConnection을 생성한 뒤 onicecandidate 이벤트 핸들러를 설정한다.
//    Peer A는 start_stream 이벤트를 시그널링 서버를 통해 Peer B에게 전달한다.
//    Console 출력: Peer A: emit start stream
// 2. Peer B는 getUserMedia()를 호출해 로컬 오디오/비디오 스트림을 설정하고, RTCPeerConnection을 생성한 뒤 onicecandidate 이벤트 핸들러를 설정한다.
//    Peer B는 start_stream 이벤트를 시그널링 서버를 통해 Peer A에게 전달한다.
//    Console 출력: Peer B: emit start stream
// 3. Peer A는 start_stream 이벤트를 수신하면 createDataChannel('chat')으로 DataChannel을 생성하고 이벤트 핸들러를 설정한다.
//    이후 createOffer()를 호출해 Offer를 생성하고 setLocalDescription(offer)으로 로컬 SDP를 설정한 뒤, 시그널링 서버를 통해 Peer B에게 Offer를 전달한다.
//    Console 출력: Peer A: start stream
// 4. Peer B는 Offer를 수신하면 setRemoteDescription(offer)으로 설정하고, ondatachannel 이벤트를 통해 DataChannel을 수신하고 이벤트 핸들러를 설정한다.
//    이후 createAnswer()를 호출해 Answer를 생성하고 setLocalDescription(answer)으로 로컬 SDP를 설정한 뒤, 시그널링 서버를 통해 Peer A에게 Answer를 전달한다.
//    Console 출력: Peer B: offer
// 5. Peer A는 Answer를 수신하면 setRemoteDescription(answer)으로 설정한다.
//    Console 출력: Peer A: answer
// 6. Peer A와 Peer B는 onicecandidate 이벤트를 통해 ICE Candidate를 수집하고, 시그널링 서버를 통해 상대방에게 전송한다.
//    수신한 ICE Candidate는 addIceCandidate()를 호출해 PeerConnection에 추가된다.
//    Console 출력: Peer A: emit ice candidate, add ice candidate, Peer B: add ice candidate, emit ice candidate
// 7. Peer A와 Peer B는 P2P 연결이 확립되면 ontrack 이벤트를 통해 상대방의 오디오/비디오 트랙을 수신하고 화면에 출력한다.
//    또한 DataChannel의 onopen 이벤트를 통해 채팅 기능이 활성화된다.
//    Console 출력: on track, DataChannel 열림

export default function WebRTCDemo() {
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
  const [totalMember, setTotalMember] = useState<number>(0);
  const [isCaller, setIsCaller] = useState<boolean | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  useEffect(() => {
    // socket.io는 연결이 끊어지면 자동으로 재연결을 시도한다.
    // Socket.IO는 WebSocket을 사용하는 방법 중 하나지만, WebSocket이 지원되지 않거나 문제가 발생할 경우
    // HTTP long polling과 같은 다른 방법을 사용하여 통신을 유지하기 때문에 탄력성이 뛰어나다.
    const socket = io('http://localhost:8080');
    socketRef.current = socket;

    socket.on('connect', () => setConnectionStatus(ConnectionStatus.CONNECTED));
    socket.on('connect_error', () => setConnectionStatus(ConnectionStatus.ERROR));
    socket.on('disconnect', () => setConnectionStatus(ConnectionStatus.DISCONNECTED));

    socket.on('join_room', () => setReceivedMessages((prev) => [...prev, 'someone joined!']));
    socket.on('room_member_count', (count) => setTotalMember(count));
    socket.on('leave_room', () => setReceivedMessages((prev) => [...prev, 'someone leaved!']));

    // 1. Offer/Answer 단계('start_stream' -> 'offer' -> 'answer')
    // Offer와 Answer는 미디어 설정(트랙 정보, 코덱, 해상도 등)을 협상하는 과정이다.
    // Peer A가 Offer를 보내고, Peer B가 이를 처리해 Answer를 반환하면, 양측은 미디어 설정 정보를 교환한 상태이다.
    // 하지만 이 단계만으로는 연결에 필요한 네트워크 경로가 결정되지 않는다.

    // 1-1. 최초 내 브라우저(Peer A)에서 실행되는 코드
    socket.on('start_stream', async (isCaller) => {
      try {
        // start_stream 이벤트는 브로드캐스트 방식으로 서버에서 방의 다른 사용자들에게만 전송된다.
        // 따라서 방에 참가자가 1명뿐일 경우, start_stream 이벤트가 전달될 대상이 없으므로 연결이 시작되지 않는다.
        // 방에 다른 사용자가 입장한 뒤 start 버튼을 클릭하면 start_stream 이벤트가 먼저 참가하여 start 버튼을 클릭했던 사용자에게 전달되어 Peer 연결이 시작된다.
        // 이때 새로 입장한 사용자는 isCaller가 false인 상태로 서버에 start_stream 이벤트를 전송하기 때문에
        // 먼저 참가하고 있던 사용자는 isCaller가 true이지만 서버로부터 전달받는 isCaller 값은 false가 된다.
        if (peerConnectionRef.current && !isCaller) {
          // 1. DataChannel 생성
          // PeerConnection을 통해 데이터 전송용 DataChannel을 생성한다.
          // DataChannel 생성 → Offer 생성 순서를 지켜야 한다.
          // 이 순서를 지키지 않으면 DataChannel에 대한 정보가 Offer에 포함되지 않아
          // 상대방(Peer B)이 ondatachannel 이벤트를 통해 채널을 수신하지 못한다.
          const dataChannel = peerConnectionRef.current.createDataChannel('chat');
          dataChannelRef.current = dataChannel;

          // 2. DataChannel 이벤트 핸들러 설정
          // DataChannel이 열리거나 닫힐 때, 혹은 메시지를 수신할 때 이벤트를 처리한다.
          dataChannel.onopen = () =>
            setReceivedMessages((prev) => [...prev, 'DataChannel 열림 (Peer A)']);
          dataChannel.onclose = () =>
            setReceivedMessages((prev) => [...prev, 'DataChannel 닫힘 (Peer A)']);
          dataChannel.onmessage = (e) =>
            setReceivedMessages((prev) => [...prev, `상대방: ${e.data}`]);

          // 3. Offer 생성 및 Local SDP(Session Description Protocol) 설정
          // Peer A는 현재 PeerConnection에 설정된 트랙, DataChannel 등의 정보를 포함하는 Offer를 생성하고,
          // 이를 Local SDP로 설정하여 상대방과 연결 준비를 한다.
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);

          // 4. Offer 전송
          // 생성된 Offer를 서버를 통해 상대방(Peer B)에게 전송합니다.
          socket.emit('offer', offer, roomName);

          console.log('start stream');
        }
      } catch (err) {
        console.error(err);
      }
    });

    // 1-2. 상대 브라우저(Peer B)에서 실행되는 코드
    socket.on('offer', async (offer) => {
      try {
        if (peerConnectionRef.current) {
          // 1. 상대방(Peer A)이 생성한 DataChannel 수신
          // Peer B는 Peer A가 생성한 DataChannel을 감지하고 수신한다.
          peerConnectionRef.current.ondatachannel = (e) => {
            const receiveChannel = e.channel;
            dataChannelRef.current = receiveChannel;

            // 2. DataChannel 이벤트 핸들러 설정
            // DataChannel이 열리거나 닫힐 때, 혹은 메시지를 수신할 때 이벤트를 처리한다.
            receiveChannel.onopen = () =>
              setReceivedMessages((prev) => [...prev, 'DataChannel 열림 (Peer B)']);
            receiveChannel.onclose = () =>
              setReceivedMessages((prev) => [...prev, 'DataChannel 닫힘 (Peer B)']);
            receiveChannel.onmessage = (e) =>
              setReceivedMessages((prev) => [...prev, `상대방: ${e.data}`]);
          };

          // 3. Remote Offer 설정
          // 상대방(Peer A)이 보낸 Offer를 Remote SDP로 설정하여 연결 준비를 한다.
          await peerConnectionRef.current.setRemoteDescription(offer);

          // 4. Answer 생성 및 Local SDP 설정
          // Peer B는 상대방(Peer A)의 Offer에 응답하는 Answer를 생성하고 Local SDP로 설정한다.
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);

          // 5. Answer 전송
          // 생성된 Answer를 서버를 통해 상대방(Peer A)에게 전송한다.
          socket.emit('answer', answer, roomName);

          console.log('offer');
        }
      } catch (err) {
        console.error('Offer 처리 중 에러 발생:', err);
      }
    });

    // 1-3. 상대 브라우저(Peer B)에서 answer를 받은 후 내 브라우저(Peer A)에서 실행되는 코드
    // 이 시점까지는 서로의 연결 정보만 설정된 상태이며, 실제 네트워크 경로는 결정되지 않았다.
    socket.on('answer', async (answer) => {
      try {
        // 1. Remote Answer 설정
        // 상대방(Peer B)이 보낸 Answer를 Remote SDP로 설정하여 양측 연결을 완료한다.
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(answer);

          console.log('answer');
        }
      } catch (err) {
        console.error('Answer 처리 중 에러 발생:', err);
      }
    });

    // 2. ICE Candidate 단계
    // Offer/Answer 교환 후, 양측 브라우저는 ICE Candidate(네트워크 IP 주소와 포트 정보)를 수집한다.
    // 각 브라우저는 onicecandidate 이벤트를 통해 ICE Candidate를 상대방에게 전송한다.
    // 양측은 받은 ICE Candidate를 addIceCandidate를 사용해 설정하며, 최적의 네트워크 경로를 결정한다.
    // 이 과정에서 연결 테스트를 수행하며 최종적으로 P2P 연결이 된다.

    // 2-1. 상대방으로부터 ICE Candidate를 수신하면 PeerConnection에 추가한다.
    socket.on('ice', async (ice) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(ice);

          console.log('add ice candidate');
        }
      } catch (err) {
        console.error('ICE Candidate 추가 중 에러 발생:', err);
      }
    });

    return () => {
      socket.disconnect();
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

  const startStream = useCallback(
    async (deviceId?: string) => {
      try {
        console.log('run');
        const constraintsWithDevice = {
          ...constraints,
          video: deviceId ? { deviceId: { exact: deviceId } } : true,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraintsWithDevice);
        mediaStreamRef.current = mediaStream;

        if (videoRef.current) videoRef.current.srcObject = mediaStream;

        if (!peerConnectionRef.current) {
          // 초기 PeerConnection 생성
          const peerConnection = new RTCPeerConnection(iceServers);
          peerConnectionRef.current = peerConnection;

          peerConnection.onicecandidate = (e) => {
            if (e.candidate && socketRef.current) {
              socketRef.current.emit('ice', e.candidate, roomName);
              console.log('emit ice candidate');
            }
          };

          peerConnection.ontrack = (e) => {
            if (peerVideoRef.current) {
              peerVideoRef.current.srcObject = e.streams[0];
              console.log('on track');
            }
          };

          mediaStream.getTracks().forEach((track) => peerConnection.addTrack(track, mediaStream));

          if (socketRef.current) {
            socketRef.current.emit('start_stream', { roomName, isCaller });
            console.log('emit start stream');
          }
        } else {
          // 이미 PeerConnection이 생성되어 있는 상태에서 카메라 변경 시
          // WebRTC 연결을 끊지 않고 기존의 비디오 트랙을 새로운 트랙으로 교체
          const [videoTrack] = mediaStream.getVideoTracks(); // 새로 선택한 카메라의 비디오 트랙
          // getSenders()는 현재 RTCPeerConnection에서 모든 RTCRtpSender 객체를 반환한다.
          // RTCRtpSender는 특정 트랙(비디오, 오디오 등)을 원격 피어로 전송하는 WebRTC 객체이다.
          // 각 RTCRtpSender에는 트랙 정보(예: track.kind), 코덱 설정 등이 포함된다.
          const senders = peerConnectionRef.current.getSenders();

          // 모든 RTCRtpSender 중에서, 전송 중인 트랙의 종류(track.kind)가 video인 것을 찾는다.
          // sender.track은 해당 RTCRtpSender에서 전송 중인 트랙을 나타낸다.
          // 여기서 videoSender는 기존에 원격 피어로 비디오를 전송하고 있는 객체이다.
          const videoSender = senders.find((sender) => sender.track?.kind === 'video');
          // RTCRtpSender.replaceTrack()을 호출하여, 기존에 전송 중인 비디오 트랙을 새로 선택한 videoTrack으로 교체한다.
          // 기존 연결(RTCPeerConnection)을 끊지 않고도 새로운 트랙을 적용할 수 있다.
          if (videoSender) await videoSender.replaceTrack(videoTrack);
        }

        setIsCameraEnabled(true);
        setIsAudioMuted(true);
        setIsStreaming(true);
      } catch (err) {
        console.error(err);
      }
    },
    [isCaller, roomName],
  );

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
    if (isCaller !== null) {
      startStream(e.target.value);
    } else {
      console.error('isCaller is not set.');
    }
  };

  const handleRoomNameInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRoomName(e.target.value);

  const handleRoomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socketRef.current && roomName.trim()) {
      socketRef.current.emit('join_room', roomName, (callerStatus: boolean) => {
        setIsCaller(callerStatus);
        setIsRoomJoin(true);
        startStream();
      });
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
        <div className='flex flex-col gap-y-5 p-5'>
          <div className='rounded-md border border-black p-2'>
            <p>방 이름: {roomName}</p>
            <p>참여 인원: {totalMember}</p>
            <h2>WebSocket 연결 상태: {connectionStatus}</h2>
          </div>
          <div className='flex flex-col gap-y-5 rounded-md border border-black p-2'>
            <div className='flex flex-col gap-y-10 sm:flex-row sm:justify-center sm:gap-x-10'>
              <div className='max-w-1/2'>
                <p>나</p>
                <video className='h-auto w-full rounded-md' playsInline autoPlay ref={videoRef} />
              </div>
              <div className='max-w-1/2'>
                <p>상대방</p>
                <video
                  className='h-auto w-full rounded-md'
                  playsInline
                  autoPlay
                  ref={peerVideoRef}
                />
              </div>
            </div>
            {isStreaming && (
              <div className='flex gap-x-2'>
                <select
                  className='rounded-md border border-black px-2 py-1'
                  value={selectedCameraId}
                  onChange={handleCameraChange}
                >
                  {cameraList.map((value) => (
                    <option key={value.deviceId} value={value.deviceId}>
                      {value.label}
                    </option>
                  ))}
                </select>
                <button
                  className={`h-8 whitespace-nowrap rounded-md px-2 text-white ${isCameraEnabled ? 'bg-red-500' : 'bg-blue-500'}`}
                  onClick={handleCameraClick}
                >
                  {isCameraEnabled ? 'Camera Off' : 'Camera On'}
                </button>
                <button
                  className={`h-8 whitespace-nowrap rounded-md px-2 text-white ${isAudioMuted ? 'bg-red-500' : 'bg-blue-500'}`}
                  onClick={handleMuteClick}
                >
                  {isAudioMuted ? 'Mute' : 'Unmute'}
                </button>
              </div>
            )}
          </div>
          <div className='flex flex-col gap-y-2'>
            <div className='h-[100px] overflow-y-auto rounded-md border border-black p-2'>
              {receivedMessages.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
            <div className='flex items-center gap-x-1'>
              <input
                className='h-10 w-full rounded-md border border-gray-400 px-2.5 focus:border-2 focus:border-blue-500 focus:outline-none'
                type='text'
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder='메시지를 입력하세요'
                style={{ marginRight: '10px' }}
              />
              <button
                className='h-9 whitespace-nowrap rounded-md bg-blue-500 px-4 text-white'
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex h-screen items-center justify-center'>
          <form className='flex items-center gap-x-2' onSubmit={handleRoomSubmit}>
            <input
              className='h-10 w-full rounded-md border border-gray-400 px-2.5 text-lg focus:border-2 focus:border-blue-500 focus:outline-none'
              type='text'
              placeholder='room name'
              value={roomName}
              onChange={handleRoomNameInput}
            />
            <button
              className='h-9 whitespace-nowrap rounded-md bg-blue-500 px-2 text-lg text-white'
              type='submit'
            >
              Enter room
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
