# 1. WebRTC란?

- WebRTC란 웹 실시간 커뮤니케이션(Web Real-Time Communication)의 약자로, 웹 애플리케이션과 사이트가 중앙 서버 없이 브라우저 간에 오디오나 영상 미디어를 포착하고 마음대로 스트림할 뿐 아니라, 임의의 데이터도 교환할 수 있도록 하는 기술이다. 이를 통해 사용자는 플러그인이나 추가 소프트웨어 없이도 브라우저에서 직접 음성 및 비디오 통신은 물론 peer-to-peer(P2P) 데이터 교환을 할 수 있다.

- 반면에 WebSocket의 경우 하나의 서버에 여러 WebSocket이 연결되어 있으며, 한 WebSocket이 메시지를 보내면 해당 메시지는 서버로 전달된다. 서버는 이 메시지를 수신한 후 연결된 모든 WebSocket에 전달하는 역할을 한다. 즉, 서버는 메시지를 브로드캐스트하여 모든 클라이언트에게 공유한다.

- 예를 들어, 채팅룸에서 상대방에게 메시지를 보내면, 그 메시지는 먼저 서버로 전달되고 이후 서버가 상대방에게 메시지를 전달하게 된다. 즉, 메시지를 보낼 때 사실 상대방에게 직접 보내는 것이 아니라 서버에 보내는 것이며, 서버가 이를 중개해 상대방에게 메시지를 전달하는 것이다. 따라서 항상 서버를 거쳐야만 메시지 전송이 이루어진다.

## 1. WebRTC 시작하기

- WebRTC를 시작하려면 먼저 RTCPeerConnection 객체의 인스턴스를 생성해야 한다. 이 객체는 WebRTC API의 핵심 요소로, 피어 간의 연결을 설정하는 데 사용된다. 새로운 RTCPeerConnection 객체는 다음과 같이 생성할 수 있다.

  ```javascript
  const peerConnection = new RTCPeerConnection();
  ```

- RTCPeerConnection 객체를 생성한 후에는 오디오, 비디오 및 데이터 전송을 위한 통신 채널 설정을 시작할 수 있다.

## 2. 오디오 및 비디오 스트림 설정하기

- 오디오 및 비디오 스트림을 RTCPeerConnection에 추가하려면 `getUserMedia` 메서드를 사용하여 사용자 디바이스에서 오디오 및 비디오 스트림을 가져오면 된다. 다음은 이를 수행하는 방법에 대한 예시이다.

  ```javascript
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    const tracks = mediaStream.getTracks();
    tracks.forEach((track) => peerConnection.addTrack(track, mediaStream));
  } catch (err) {
    console.error(err);
  }
  ```

- 위 예시에서는 `getUserMedia`를 사용하여 사용자 디바이스에서 오디오 및 비디오 스트림을 가져오고 있다. 스트림에 접근할 수 있게 되면 `addTrack` 메서드를 사용하여 RTCPeerConnection 객체에 스트림을 추가할 수 있다.

## 3. 피어 연결 설정하기

- 오디오 및 비디오 스트림을 설정한 후에는 피어 간의 연결을 설정할 차례다. 이를 위해 협상 프로세스를 시작하는 Offer를 생성해야 한다. 다음은 Offer를 생성하는 방법에 대한 예시이다.

  ```javascript
  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    // 원격 피어에게 offer 전송
    socket.emit('offer', offer, roomName);
  } catch (err) {
    console.error(err);
  }
  ```

- 위 예시에서는 `createOffer` 메서드를 사용하여 피어 연결에 대한 Offer를 생성하고 있다. Offer가 생성되면 이를 RTCPeerConnection 객체의 로컬 설명(local description)으로 설정한다. 마지막으로 선택한 시그널링 방법(위 예시에서는 socket io)을 사용하여 원격 피어에게 Offer를 보낼 수 있다.

## 4. 수신 Offer 및 응답 처리하기

- 원격 피어가 Offer를 보내면, 이를 RTCPeerConnection 객체의 원격 설명으로 설정하여 처리할 수 있다. 다음을 이를 수행하는 방법에 대한 예시이다.

  ```javascript
  try {
    await peerConnection.setRemoteDescription(offer);
    // offer에 대한 answer 생성
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    // 원격 피어에게 answer 전송
    socket.emit('answer', answer, roomName);
  } catch (err) {
    console.error(err);
  }
  ```

- 위 코드에서는 원격 피어의 Offer를 RTCPeerConnection 객체의 원격 설명으로 설정하고 있다. 그 후, `createAnswer` 메서드를 사용하여 Offer에 대한 응답을 생성하고 이를 로컬 설명으로 설정한 다음 원격 피어에게 다시 전송한다.

# 2. WebRTC의 주요 기능

1. **피어 투 피어 연결**: WebRTC를 사용하면 중앙 서버 없이도 사용자 간에 직접 커뮤니케이션을 할 수 있다. 따라서 실시간 커뮤니케이션 애플리케이션에서 설정 시간을 단축하고 대기 시간을 줄일 수 있다.

2. **오디오 및 비디오 커뮤니케이션**: 사용자는 WebRTC를 사용하여 브라우저 또는 모바일 애플리케이션에서 직접 오디오 및 비디오에 접근할 수 있다.

3. **데이터 교환**: WebRTC는 오디오 및 비디오 통신 외에도 RTCDataChannel를 사용하여 실시간으로 데이터를 교환할 수 있다. 이 기능은 참가자 간의 파일, 문자 메시지 또는 기타 모든 유형의 정보를 공유하는 데 유용하다.

4. **보안**: WebRTC는 오디오 및 비디오 스트림을 무단 엑세스로부터 보호하기 위해 SRTP 및 DTLS와 같은 암호화 프로토콜을 사용하여 보안 및 개인 정보 보호를 우선시한다. 또한 방화벽이나 NAT 뒤에 있는 사용자 간의 통신을 용이하게 하기 위해 STUN 및 TURN 서버를 통한 보안 연결을 지원한다.

5. **크로스 플랫폼 지원**: WebRTC는 주요 웹 브라우저는 물론 모바일 플랫폼에서 지원된다.

# 3. WebRTC 아키텍쳐

## 1. 시그널링

- 시그널링은 두 장치가 P2P 통신을 시작하기 전에 연결을 설정하고 네트워크 및 미디어 정보를 교환하는 과정으로, 이를 통해 세션 시작, 오디오 및 비디오 코덱 협상, 암호화 키 교환 등이 이루어진다. 시그널링은 WebSocket, HTTP 등의 프로토콜을 사용하여 수행된다.

- 시그널링 서버는 이 과정에서 중요한 역할을 하며, 두 피어 간의 통신 채널을 설정하는 중개자 역할을 한다. 시그널링 서버는 SDP(Session Description Protocol) 요청(Offer)과 응답(Answer), 후보 IP 주소 등 피어 투 피어 연결을 시작하는 데 필요한 메타데이터를 교환한다. WebRTC 세션에서는 이 과정을 통해 피어 간의 직접 연결을 설정한 이후에는 추가적인 서버 없이도 통신이 가능하다.

### 1-1. 시그널링 프로세스

1. **Offer - Answer 교환**: Peer A(offerer)는 WebRTC 연결을 설정하기 위해 SDP를 포함한 Offer를 시그널링 서버로 전송한다.

2. **서버 릴레이**: 시그널링 서버는 받은 Offer를 Peer B(answerer)에게 전달한다.

3. **응답 생성**: Peer B는 Offer를 처리하고, SDP를 사용하여 자신의 응답을 생성한 후 이를 시그널링 서버로 전송한다.

4. **서버 릴레이**: 시그널링 서버는 Peer B의 응답을 Peer A로 전달한다.

5. **ICE 후보 교환**: Peer A와 Peer B는 시그널링 서버를 통해 ICE 후보를 교환하여 최적의 P2P 연결 경로를 찾는다.

6. **연결 설정**: ICE 후보 교환이 완료되고 연결 확인에 성공하면, Peer A와 Peer B 간에 WebRTC 연결이 설정된다.

   <img width="100%" alt="signaling" src="https://github.com/user-attachments/assets/c358659b-6bde-4c5d-a7c5-cf9f1863a310">

   <img width="100%" alt="signaling" src="https://github.com/user-attachments/assets/aff6f92f-ad1a-4906-8913-1b2e03b91e31">

## 2. SDP

- SDP(Session Description Protocol)는 실시간 통신 시스템에서 두 피어 간의 세션 정보(데이터의 형식, 조건, 경로 등)를 설명하고 교환하는 데 사용되는 텍스트 기반의 데이터 포맷이다. 주로 WebRTC와 같은 P2P 통신에서 사용되며, 미디어 스트림 교환을 위해 필요한 메타데이터와 네트워크 정보를 포함한다. 예를 들어, 비디오의 해상도, 코덱, 오디오 전송 여부 등과 같은 초기 설정 정보와 IP 주소, 포트, ICE 후보 등 네트워크 경로 관련 정보 등이 있다.

### 2-1. SDP Offer/Answer 모델

- WebRTC에서는 피어 간 통신 세션을 설정하기 위해 SDP Offer/Answer 모델을 사용한다. 이 프로세스에는 사용자가 세션을 시작하면 브라우저는 자신의 기능과 기본 설정을 포함한 SDP Offer를 생성하고, 이를 상대 피어에게 전송한다. 상대 피어는 자신의 설정을 반영한 SDP Answer로 응답하며, 이를 통해 두 피어는 통신 세션에 대한 공통 매개변수에 합의하고 P2P 연결을 설정한다.

### 2-2. SDP 속성

- SDP에는 통신 세션의 미디어 스트림과 네트워크 세부 정보를 설명하는 다양한 속성이 포함되어 있다. WebRTC에서 사용되는 몇가지 일반적인 SDP 속성은 다음과 같다.

  - **a=mid**: SDP Offer/Answer 교환 내의 미디어 스트림을 식별한다.

  - **a=rtpmap**: 페이로드 유형을 RTP 코덱에 매핑한다.

  - **a=candidate**: ICE 후보에 대한 네트워크 연결 정보를 설명한다.

  - **a=ice-ufrag 및 a=ice-pwd**: 연결 확인을 위한 ICE 사용자 이름과 비밀번호를 포함한다.

## 3. ICE

- ICE(Interactive Connectivity Establishment)는 NAT와 방화벽을 통과하여 피어 간의 직접 연결을 설정하는 프로토콜로, 최적의 연결 경로를 찾기 위해 IP 주소와 포트를 포함한 후보들을 수집하고 STUN 및 TURN 서버를 활용해 네트워크 장애물을 우회한다. STUN은 퍼블릭 IP를 얻는 데 사용되며, TURN은 직접 연결이 불가능할 때 데이터를 중계한다. WebRTC에서는 ICE가 SDP와 함께 작동하여 브라우저 간의 안전하고 효율적인 P2P 연결을 설정한다. 세션이 시작되면 브라우저는 ICE 후보를 포함한 SDP 메시지를 교환하며, 이 메시지에는 연결을 설정하는 데 필요한 네트워크 주소와 전송 프로토콜 정보가 포함된다. 이후 ICE는 이 정보를 사용해 네트워크 장애물을 우회하고, STUN과 TURN을 통해 피어 간에 직접 연결을 설정한다.

### 3-1. ICE 후보

- ICE 후보는 P2P 통신에 사용할 수 있는 네트워크 엔드포인트이다. 이러한 후보에는 IP 주소, 포트 및 전송 프로토콜이 포함된다. ICE 협상 과정에서 피어는 서로 연결 할 수 있는 최적의 경로를 찾기 위해 ICE 후보를 교환한다.

### 3-2. ICE 후보 수집

- WebRTC 엔드포인트는 ICE 후보를 수집하기 위해 STUN(NAT를 위한 세션 탐색 유틸리티) 및 TRUN(NAT 주변 릴레이를 이용한 탐색) 서버와 같은 기술을 사용한다. STUN 서버는 디바이스의 공용 IP 주소와 포트를 검색하는 데 도움을 주고, TURN 서버는 직접 P2P 연결이 불가능한 경우 통신을 위한 중계 지점 역할을 한다.

### 3-3. ICE 연결 확인

- ICE 후보가 교환되면 피어 간의 최적의 통신 경로를 결정하기 위해 연결 확인이 수행된다. 여기에는 연결 확인을 위해 서로의 후보에게 STUN 요청을 보내는 것이 포함된다. 성공하면 피어들은 미디어 전송을 위해 직접 P2P 연결을 설정할 수 있다.

## 4. STUN

- STUN(Session Traversal Utilities for NAT)은 NAT 또는 방화벽 뒤에 있는 피어의 공인 IP 주소와 포트를 검색하는 데 사용되는 프로토콜이다. 이를 통해 피어의 외부 연결을 확인하고, 직접 피어 투 피어 연결을 설정하는 데 도움을 준다. 클라이언트는 STUN 서버에 요청을 보내 자신의 공개 IP 주소를 발견하고, 라우터의 제한을 확인하여 피어 간의 직접 연결이 가능한지 여부를 파악한다.

- 특히 피어가 대칭 NAT 또는 방화벽 뒤에 있을 때 직접 연결을 설정하기 위해 피어의 공인 IP 주소와 포트를 확인하기 위해 WebRTC에서 STUN 서버가 필요하다.

  <img width="100%" alt="stun" src="https://github.com/user-attachments/assets/c99f6928-b636-4f11-870e-c7ee6692f5d3">

## 5. NAT

- NAT(Network Address Translation)는 내부 네트워크에서 사용되는 사설 IP 주소를 외부 네트워크(인터넷)에서 사용되는 공인 IP 주소로 변환하는 기술이다. 가정이나 기업의 내부 네트워크는 사설 IP 주소를 사용하고, 외부와의 통신을 위해 NAT는 이를 공인 IP 주소로 변환한다. 라우터는 공인 IP 주소를 가지고 있으며, 내부 단말들은 비공개 IP 주소를 사용한다. 요청은 단말의 비공개 IP 주소에서 라우터의 공인 IP 주소와 고유한 포트를 기반으로 번역되어, 각 단말이 유일한 공인 IP 없이 인터넷에서 접근 가능하게 된다.

## 6. TURN

- TURN(Traversal Using Relays around NAT)은 제한된 네트워크 환경에서 직접 P2P 통신이 불가능할 때 사용되는 폴백 메커니즘이다. TURN 서버는 데이터 패킷을 중계하여 피어 간의 통신을 원활하게 하는 중계 지점 역할을 한다. 일부 라우터는 Symmetric NAT라는 제한을 사용하여 피어들이 이전에 연결한 적 있는 연결만 허용한다. TURN은 이러한 제한을 우회하기 위해 TURN 서버를 사용하여 모든 정보를 전달하고, 서버가 모든 패킷을 중계하여 피어 간 통신을 가능하게 한다. 이 방식은 오버헤드가 발생하므로, 다른 대안이 없을 경우에만 사용된다.

  <img width="100%" alt="turn" src="https://github.com/user-attachments/assets/bf0cdac1-70a2-4b15-aed8-8e3a9cd4b191">

# 4. WebRTC Data Channel

- WebRTC 데이터 채널은 브라우저 간에 임의의 데이터 타입을 P2P로 통신할 수 있는 WebRTC의 기능이다. 즉, 서버를 통해 정보를 전달할 필요 없이 두 브라우저 간에 직접 연결을 설정하고, 연결이 설정되면 이 연결 위에 데이터 채널을 생성하여 텍스트, 이미지, 파일, 동영상 스트림 등 모든 타입의 데이터를 전송할 수 있다. 데이터 채널은 RTCPeerConnection 연결이 확립된 후 시그널링 과정을 통해 생성되고 관리된다.

## 1. 데이터 채널 설정하기

- WebRTC에서 데이터 채널을 만들려면 먼저 RTCPeerConnection API를 사용하여 두 피어 간에 연결을 설정해야 한다. 연결이 설정되면 `createDataChannel()` 메서드를 사용하여 데이터 채널을 만들 수 있다.

  ```javascript
  const dataChannel = peerConnection.creeateDataChannel('myDataChannel');
  ```

- 그런 다음 이벤트 핸들러를 설정하여 데이터 채널과 관련된 다양한 이벤트(ex: onopen, onmessage, onerror, onclose)를 처리할 수 있다.

  ```javascript
  dataChannel.onopen = () => console.log('데이터 채널 열림');
  dataChannel.onclose = () => console.log('데이터 채널 닫힘');
  ```

## 2. 데이터 보내기 및 받기

- 데이터 채널이 설정되면 피어 간에 데이터 송수신을 시작할 수 있다. 데이터 채널에서 `send()` 메서드를 호출하여 데이터를 보낼 수 있다.

  ```javascript
  dataChannel.send('Hello, world');
  ```

- 수신 측에서는 onmessage 이벤트를 수신 대기하여 들어오는 데이터를 처리할 수 있다.

  ```javascript
  dataChannel.onmessage = (e) => console.log('데이터 채널 메시지:', e.data);
  ```

## 3. 데이터 채널 옵션

- 데이터 채널을 만들 때 다양한 옵션을 지정하여 동작을 구성할 수 있다. 일부 옵션은 다음과 같다.

- **ordered**: 데이터가 전송된 순서대로 전달될지 여부이다.

- **maxRetransmits**: 승인되지 않은 메시지에 대한 최대 재전송 횟수이다.

- **maxPacketLifeTime**: 재전송을 계속할 수 있는 최대 시간(ms)이다.

  ```javascript
  const dataChannelOptions = {
    ordered: true,
    maxRetransmits: 3,
    maxPacketLifeTime: 3000,
  };

  const dataChannel = peerConnection.creeateDataChannel('myDataChannel', dataChannelOptions);
  ```

# 5. WebRTC의 인터페이스

- Media Capture and Streams API(일명 MediaStream API)는 오디오와 비디오 데이터를 웹 환경에서 실시간 스트리밍할 수 있도록 지원하는 WebRTC 관련 API이다. 이 API는 미디어 스트림 자체와 이를 구성하는 각 오디오, 비디오 트랙을 관리하고, 트랙 품질이나 형식에 대한 제한(Constraints)을 설정할 수 있으며, 비동기적 데이터 활용을 위한 성공, 오류 콜백 및 다양한 이벤트 처리를 위한 인터페이스와 메서드를 제공한다. 이를 통해 브라우저에서 실시간 미디어를 캡처, 처리, 전송하는 기능을 유연하고 안전하게 구현할 수 있다.

- 아래 내용을 통해, WebRTC의 주요 구성 요소들은 다음과 같이 서로 연계된다.

  1. MediaDevices와 getUserMedia를 통해 로컬 기기의 카메라·마이크 스트림을 얻고
  2. MediaStream을 통해 이 미디어를 다루며
  3. RTCPeerConnection을 사용해 해당 스트림을 원격 피어에게 전송하거나 피어로부터 수신하고
  4. RTCDataChannel을 통해 추가적인 비미디어 데이터 교환이 가능해진다.

## 1. MediaDevices

- MediaDevices 인터페이스는 `navigator.mediaDevices`를 통해 접근할 수 있으며, 카메라, 마이크 공유 화면 등 현재 연결된 사용자의 미디어 입력 장치에 대한 접근을 제공한다. `getUserMedia()` 메서드를 통해 카메라/마이크 스트림을 요청할 수 있고, `enumerateDevices` 메서드를 사용하여 오디오 및 비디오 스트림 캡처를 위한 특정 장치에 대한 접근을 요청할 수 있다.

### 1-1. MediaDevices.getUserMedia()

- `getUserMedia()`는 MediaDevices 인터페이스의 메서드로, 사용자의 오디오 및 비디오 입력 장치에 대한 접근을 요청하는 데 사용된다. 이 메서드는 사용자에게 마이크와 카메라에 접근할 수 있는 권한을 묻는 메시지를 표시하고 오디오 및 비디오 스트림이 포함된 MediaStream 객체를 반환한다. 반환된 MediaStream 객체는 비디오 태그나 RTCPeerConnection에 입력으로 활용 가능하다.

  ```javascript
  const getMedia = async (constraints) => {
    const constraints = { audio: true, video: true };
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      /* use the stream */
    } catch (err) {
      /* handle the error */
    }
  };
  ```

### 1-2. MediaDevices.enumerateDevices()

- `enumerateDevices()`는 MediaDevices 인터페이스의 메서드로, 현재 시스템에 연결된 카메라, 마이크, 스피커 등 사용 가능한 오디오, 비디오 입출력 장치 목록을 조회하고, 해당 장치들의 정보를 담은 MediaDeviceInfo 객체 배열을 반환한다. 이 메서드는 장치 접근 권한을 직접 요청하지 않으며, 필요한 경우 getUserMedia를 통해 별도로 접근 권한을 획득할 수 있다.

  ```javascript
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('enumerateDevices()를 지원하지 않습니다.');
    return;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    devices.forEach((device) =>
      console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`),
    );
  } catch (err) {
    console.log(`${err.name}: ${err.message}`);
  }
  ```

  > [MDN: MediaDevices](https://developer.mozilla.org/ko/docs/Web/API/MediaDevices)

## 2. MediaStream

- MediaStream 인터페이스는 WebRTC 세션에서 송수신되는 오디오 및 비디오 스트림을 나타내며, 이를 통해 사용자는 자신의 디바이스(카메라, 마이크)에서 캡처한 미디어에 접근할 수 있다. MediaStream 객체는 하나 이상의 오디오, 비디오 트랙을 포함할 수 있으며, 각 트랙은 MediaStreamTrack의 인스턴스로 저장된다. 이 트랙들을 전송하기 전에 적절히 조작, 처리함으로써 미디어 스트림을 원하는 형태로 커스터마이징할 수 있다.

### 2-1. MediaStream.getTracks()

- `getTracks()`는 MediaStream 객체에 포함된 모든 오디오 및 비디오 트랙을 배열 형태로 반환하는 메서드로, 이를 통해 현재 스트림에 어떤 트랙들이 있는지 쉽게 파악하고 필요할 경우 특정 트랙을 조작하거나 제거할 수 있다. 반환된 MediaStreamTrack 배열을 활용하면 각 트랙에 대해 음소거(비활성화)하거나 해상도, 프레임레이트 등의 품질 설정을 변경하는 등 세밀한 제어가 가능하다.

  ```javascript
  try {
    const constraints = { audio: true, video: true };
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    document.querySelector('video').srcObject = mediaStream;
    // Stop the stream after 5 seconds
    setTimeout(() => {
      const tracks = mediaStream.getTracks();
      tracks[0].stop();
    }, 5000);
  } catch (err) {
    console.error(`${err.name}: ${err.message}`);
  }
  ```

### 2-2. MediaStream.getAudioTracks()

- `getAudioTracks()`는 MediaStream 객체에 포함된 모든 오디오 트랙을 배열 형태로 반환하는 메서드이다. 이 메서드는 장치 접근 권한을 별도로 요청하지 않으며, 이미 확보된 MediaStream 내에서만 호출할 수 있다. 반환된 트랙 배열을 활용하면 오디오 트랙을 활성화, 비활성화하거나, 필요한 경우 특정 오디오 트랙을 제거하는 등 개별 오디오 신호에 대한 세밀한 제어를 수행할 수 있다.

### 2-3. MediaStream.getVideoTracks()

- `getVideoTracks()`는 MediaStream 객체에 포함된 모든 비디오 트랙을 배열 형태로 반환하는 메서드이다. 이 메서드는 이미 획득한 MediaStream 내에서 호출 가능하며, 추가적인 장치 접근 권한 요청 없이 현재 보유하고 있는 비디오 트랙 정보에 접근할 수 있다. 반환된 비디오 트랙 배열을 활용하면 해상도, 프레임레이트, 밝기 등의 영상 품질 관련 설정을 조정하거나 특정 비디오 트랙을 제거하는 등, 개별 비디오 신호에 대한 정교한 관리와 제어를 수행할 수 있다.

  > [MDN: MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)

## 3. MediaStreamTrack

- MediaStreamTrack은 미디어 스트림 객체 내의 개별 오디오 또는 비디오 트랙을 나타낸다. 트랙을 추가, 제거 또는 음소거하여 오디오 및 비디오 데이터의 흐름을 제어할 수 있다. 트랙의 종류(오디오 또는 비디오), 활성화 상태 및 제약 조건과 같은 미디어 스트림 트랙의 속성에 액세스할 수 있다.

### 3-1. MediaStreamTrack.stop()

- `stop()`은 MediaStreamTrack 객체의 메서드로, 현재 캡처되거나 재생 중인 오디오 또는 비디오 트랙을 중지하는 데 사용된다. 이 메서드를 호출하면 해당 트랙은 더 이상 미디어 데이터를 생성하지 않으며, MediaStream에서도 유효한 트랙으로 인식되지 않는다.

  ```javascript
  const stopStreamedVideo = (videoElem) => {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoElem.srcObject = null;
  };
  ```

### 3-2. MediaStreamTrack.enabled

- `enabled`는 MediaStreamTrack 인터페이스의 속성으로, 해당 트랙(오디오 혹은 비디오)이 활성화되어 있는지 여부를 나타내는 Boolean 값이다. 기본적으로 true로 설정되어 있으며, 이 값이 false로 변경되면 해당 트랙은 더 이상 오디오나 비디오 데이터를 전송하지 않아 "음소거" 상태와 유사한 동작을 하게 된다. 그러나 트랙 자체는 여전히 MediaStream에 포함되어 있어 재생 목록에서 제거되지 않으며, 언제든지 enabled 값을 다시 true로 되돌려 미디어 출력을 재개할 수 있다.

  ```javascript
  // getUserMedia는 비동기적으로 처리됨
  const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const videoTracks = mediaStream.getVideoTracks();
  videoTracks.forEach((track) => (track.enabled = !track.enabled));
  ```

  > [MDN: MediaStreamTrack](https://developer.mozilla.org/ko/docs/Web/API/MediaStreamTrack)

## 4. RTCPeerConnection

- RTCPeerConnection 인터페이스는 WebRTC 세션에서 두 피어 간 실시간 오디오, 비디오 및 데이터 전송을 위한 P2P 연결을 설정하고 관리하는 핵심 요소이다. 이를 통해 피어들은 네트워크를 통해 전달될 미디어 스트림 및 데이터 채널을 서로 교환할 수 있으며, 시그널링 과정을 통해 ICE 후보, SDP 등 필요한 연결 정보를 주고받는다. RTCPeerConnection을 활용하면 연결 과정에서 사용되는 코덱, 암호화 방식, 네트워크 환경 등을 협상할 수 있으며, 미디어 및 데이터 흐름을 원하는 형태로 관리하고 최적화함으로써 실시간 통신 환경을 유연하고 안정적으로 구성할 수 있다.

### 4-1. RTCPeerConnection.addTrack()

- `addTrack()` 메서드는 RTCPeerConnection 인터페이스의 메서드로, 로컬 오디오나 비디오 트랙과 같은 미디어 스트림의 개별 트랙을 피어 연결에 추가해 P2P 통신으로 상대방에게 전송하는 메서드다. 이를 통해 특정 MediaStreamTrack 객체를 원격 피어에 전송할 수 있으며, 반환된 RTCRtpSender 객체를 활용해 트랙의 설정 및 제어도 가능하다. addTrack()은 RTCPeerConnection 연결이 시그널링 과정을 통해 확립된 후 사용되며, 상대방 피어는 `ontrack` 이벤트를 통해 수신된 트랙을 처리할 수 있다. 이를 통해 오디오 및 비디오와 같은 실시간 미디어 데이터를 효과적으로 교환하며, 실시간 커뮤니케이션 및 스트리밍 애플리케이션의 기반을 제공한다.

  ```javascript
  // 사용자의 비디오와 오디오 스트림을 가져와 원격 피어에 추가한다.
  const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const tracks = mediaStream.getTracks();
  tracks.forEach((track) => peerConnection.addTrack(track, mediaStream));

  //...

  // 원격 피어에서 미디어 스트림(오디오 또는 비디오)을 수신하고, 해당 스트림을 비디오 요소에 할당
  const peerConnection = new RTCPeerConnection();
  peerConnection.ontrack = (e) => {
    if (peerVideoRef.current) peerVideoRef.current.srcObject = e.streams[0];
  };
  ```

### 4-2. RTCPeerConnection: icecandidate

- `icecandidate`는 RTCPeerConnection 인터페이스에서 발생하는 이벤트로, ICE(Interactive Connectivity Establishment) 후보(ICE Candidate는 네트워크 경로(IP 주소, 포트)를 나타낸다)를 생성할 때 호출된다. 이 이벤트는 피어 간 P2P 연결을 설정하기 위해 네트워크 경로 후보를 탐색하는 과정에서 실행되며, 이벤트 객체의 candidate 속성을 통해 생성된 ICE 후보를 확인할 수 있다. 이를 상대방 피어에 전달하여 서로의 네트워크 경로를 확인하고 최적의 경로를 설정하게 된다. icecandidate 이벤트는 시그널링 과정을 통해 상대방과 ICE 후보를 교환하는 과정에서 중요한 역할을 하며, NAT나 방화벽을 우회하여 원활한 P2P 통신을 가능하게 한다. 이 과정을 통해 두 피어는 연결을 확립하고, 실시간 미디어 스트림이나 데이터 채널을 교환할 수 있는 기반을 제공한다.

  ```javascript
  const peerConnection = new RTCPeerConnection();
  peerConnection.onicecandidate = (e) => socket.emit('ice', e.candidate);
  ```

  > [MDN: RTCPeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection)

## 5. RTCDataChannel

- RTCDataChannel 인터페이스는 WebRTC를 통해 오디오나 비디오 스트림과는 별도로 텍스트, 파일, 바이너리 데이터와 같은 비미디어 데이터를 두 피어 간에 실시간으로 교환하기 위한 P2P 데이터 채널을 제공한다. 이를 통해 신뢰성과 순서 보장 여부 등을 설정하여 안정적이고 정교한 데이터 전송 방식을 구현할 수 있으며, 시그널링 과정을 통해 RTCPeerConnection 연결이 확립된 후 해당 데이터 채널을 생성·관리할 수 있다. RTCDataChannel을 활용하면 오디오, 비디오 스트림 전송과 함께 다양한 형태의 정보를 유연하고 효율적으로 공유함으로써 보다 풍부한 실시간 커뮤니케이션 경험을 제공할 수 있다.

### 5-1. RTCPeerConnection.createDataChannel()

- createDataChannel()는 RTCPeerConnection 인터페이스의 메서드로, RTCPeerConnection을 통해 브라우저 간 P2P 데이터 전송을 가능하게 하며, 낮은 지연 시간과 직접 연결을 제공해 텍스트, JSON, 파일 같은 데이터를 실시간으로 송수신할 수 있다. 데이터 채널은 양방향 통신을 지원하며, 네트워크 지연을 최소화하는 직접 연결을 제공한다. 또한, 신뢰성 옵션을 설정할 수 있어 TCP처럼 순서와 신뢰성을 보장하거나, UDP처럼 비신뢰성 모드로 사용할 수도 있다.

- 반면, WebSocket은 서버를 경유하는 클라이언트-서버 방식으로 항상 안정적인 연결과 신뢰성을 제공하지만, 중간 서버를 거치기 때문에 지연 시간이 상대적으로 높다. WebRTC 데이터 채널은 파일 전송, 게임 데이터 교환처럼 P2P 통신이 필요한 상황에 적합하며, WebSocket은 채팅, 실시간 알림처럼 서버 기반 통신이 필요한 애플리케이션에 적합하다. 다만, WebRTC는 NAT/방화벽 우회 및 시그널링과 같은 복잡한 설정이 필요해 구현이 까다로운 반면, WebSocket은 설정이 간단하고 빠르게 사용할 수 있다.

  ```javascript
  // configuration은 연결 설정(ex: STUN/TURN 서버 정보)을 포함하는 객체다.
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }, // STUN 서버
      { urls: 'turn:example.com', username: 'user', credential: 'password' }, // TURN 서버
    ],
  };

  const peerConnection = new RTCPeerConnection(configuration);
  // 데이터 채널 생성
  const channel = peerConnection.createDataChannel('chat');
  // 데이터 채널을 생성할 때 메시지 전송하는 이벤트 onopen
  channel.onopen = (e) => channel.send('Hi you!');
  // 메시지를 수신하는 이벤트 onmessage
  channel.onmessage = (event) => console.log(event.data);
  ```

# 6. WebRTC data channel과 WebSocket 비교

<table>
  <thead>
    <tr>
      <th>특징</th>
      <th>WebSocket</th>
      <th>DataChannel</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>통신 방식</td>
      <td>클라이언트 ↔ 서버 연결</td>
      <td>P2P 기반 (브라우저 간 직접 연결)</td>
    </tr>
    <tr>
      <td>네트워크 경로</td>
      <td>항상 서버를 거침</td>
      <td>클라이언트 간 직접 연결</td>
    </tr>
    <tr>
      <td>지연 시간</td>
      <td>비교적 낮음 (100ms, TCP 기반)</td>
      <td>매우 낮음 (실시간 수준, UDP 기반 가능)</td>
    </tr>
    <tr>
      <td>신뢰성</td>
      <td>신뢰성 보장(TCP 기반)</td>
      <td>선택 가능 (신뢰성, 순서 보장 여부 설정 가능)</td>
    </tr>
    <tr>
      <td>연결 과정</td>
      <td>간단 (즉시 연결)</td>
      <td>복잡 (시그널링, ICE, SDP, NAT traversal 등 필요)</td>
    </tr>
    <tr>
      <td>사용 사례</td>
      <td>일반적인 클라이언트 ↔ 서버 메시징</td>
      <td>실시간 스트리밍, 파일 전송 등</td>
    </tr>
  </tbody>
</table>

> [MDN: RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel)
