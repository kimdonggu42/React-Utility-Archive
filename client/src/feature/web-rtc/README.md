# 1. WebRTC란?

- WebRTC란 웹 실시간 커뮤니케이션(Web Real-Time Communication)의 약자로, 웹 애플리케이션과 사이트가 중앙 서버 없이 브라우저 간에 오디오나 영상 미디어를 포착하고 마음대로 스트림할 뿐 아니라, 임의의 데이터도 교환할 수 있도록 하는 기술이다. 이를 통해 사용자는 플러그인이나 추가 소프트웨어 없이도 브라우저에서 직접 음성 및 비디오 통신은 물론 peer-to-peer(P2P) 데이터 교환을 할 수 있다.

- WebSocket의 경우 하나의 서버에 여러 WebSocket이 연결되어 있으며, 한 WebSocket이 메시지를 보내면 해당 메시지는 서버로 전달된다. 서버는 이 메시지를 수신한 후 연결된 모든 WebSocket에 전달하는 역할을 한다. 즉, 서버는 메시지를 브로드캐스트하여 모든 클라이언트에게 공유한다.

- 예를 들어, 채팅룸에서 상대방에게 메시지를 보내면, 그 메시지는 먼저 서버로 전달되고 이후 서버가 상대방에게 메시지를 전달하게 된다. 즉, 메시지를 보낼 때 사실 상대방에게 직접 보내는 것이 아니라 서버에 보내는 것이며, 서버가 이를 중개해 상대방에게 메시지를 전달하는 것이다. 따라서 항상 서버를 거쳐야만 메시지 전송이 이루어진다.

# 2. WebRTC의 주요 기능

1. **피어 투 피어 연결**

- WebRTC를 사용하면 중앙 서버 없이도 사용자 간에 직접 커뮤니케이션을 할 수 있다. 따라서 실시간 커뮤니케이션 애플리케이션에서 설정 시간을 단축하고 대기 시간을 줄일 수 있다.

2. **오디오 및 비디오 커뮤니케이션**

- 사용자는 WebRTC를 사용하여 브라우저 또는 모바일 애플리케이션에서 직접 오디오 및 비디오에 접근할 수 있다.

3. **데이터 교환**

- WebRTC는 오디오 및 비디오 통신 외에도 RTCDataChannel 컴포넌트를 사용하여 실시간으로 데이터를 교환할 수 있다. 이 기능은 참가자 간의 파일, 문자 메시지 또는 기타 모든 유형의 정보를 공유하는 데 유용하다.

4. **보안**

- WebRTC는 오디오 및 비디오 스트림을 무단 엑세스로부터 보호하기 위해 SRTP 및 DTLS와 같은 암호화 프로토콜을 사용하여 보안 및 개인 정보 보호를 우선시한다. 또한 방화벽이나 NAT 뒤에 있는 사용자 간의 통신을 용이하게 하기 위해 STUN 및 TURN 서버를 통한 보안 연결을 지원한다.

5. **크로스 플랫폼 지원**

- WebRTC는 주요 웹 브라우저는 물론 모바일 플랫폼에서 지원된다.

# 3. WebRTC 아키텍쳐

## 2. ICE

- ICE(Interactive Connectivity Establishment)는 NAT(Network Address Translation)와 방화벽을 통과하여 서로 다른 네트워크 환경에서 피어 간의 직접 연결을 설정하는 프로토콜이다. ICE는 피어 간의 최적의 연결 경로를 결정하기 위해 IP 주소와 포트를 포함한 후보들을 수집하고 교환한다. 이를 통해 한쪽 또는 양쪽 피어가 NAT 또는 방화벽 뒤에 있어도 직접 연결할 수 있다.

- 두 피어 간의 연결은 다양한 네트워크 장애물로 인해 불가능할 수 있다. 예를 들어, 방화벽을 통과해야 하거나, 퍼블릭 IP가 없는 단말에 유효한 주소를 할당해야 할 수 있으며, 라우터가 피어 간의 직접 연결을 허용하지 않으면 데이터를 릴레이해야 할 수 있다. 이러한 문제를 해결하기 위해 ICE는 STUN(Session Traversal Utilities for NAT)과 TURN(Traversal Using Relays around NAT) 서버를 사용한다. STUN은 피어의 퍼블릭 IP를 얻는 데 사용되고, TURN은 직접 연결이 불가능할 때 데이터를 중계한다.

## 3. STUN

- STUN(Session Traversal Utilities for NAT)은 NAT 또는 방화벽 뒤에 있는 피어의 공인 IP 주소와 포트를 검색하는 데 사용되는 프로토콜이다. 이를 통해 피어의 외부 연결을 확인하고, 직접 피어 투 피어 연결을 설정하는 데 도움을 준다. 클라이언트는 STUN 서버에 요청을 보내 자신의 공개 IP 주소를 발견하고, 라우터의 제한을 확인하여 피어 간의 직접 연결이 가능한지 여부를 파악한다.

- 특히 피어가 대칭 NAT 또는 방화벽 뒤에 있을 때 직접 연결을 설정하기 위해 피어의 공인 IP 주소와 포트를 확인하기 위해 WebRTC에서 STUN 서버가 필요하다.

  <img width="100%" alt="stun" src="https://github.com/user-attachments/assets/c99f6928-b636-4f11-870e-c7ee6692f5d3">

## 4. NAT

- NAT(Network Address Translation)는 내부 네트워크에서 사용되는 사설 IP 주소를 외부 네트워크(인터넷)에서 사용되는 공인 IP 주소로 변환하는 기술이다. 가정이나 기업의 내부 네트워크는 사설 IP 주소를 사용하고, 외부와의 통신을 위해 NAT는 이를 공인 IP 주소로 변환한다. 라우터는 공인 IP 주소를 가지고 있으며, 내부 단말들은 비공개 IP 주소를 사용한다. 요청은 단말의 비공개 IP 주소에서 라우터의 공인 IP 주소와 고유한 포트를 기반으로 번역되어, 각 단말이 유일한 공인 IP 없이 인터넷에서 접근 가능하게 된다.

## 5. TURN

- TURN(Traversal Using Relays around NAT)은 제한된 네트워크 환경에서 직접 P2P 통신이 불가능할 때 사용되는 폴백 메커니즘이다. TURN 서버는 데이터 패킷을 중계하여 피어 간의 통신을 원활하게 하는 중계 지점 역할을 한다. 일부 라우터는 Symmetric NAT라는 제한을 사용하여 피어들이 이전에 연결한 적 있는 연결만 허용한다. TURN은 이러한 제한을 우회하기 위해 TURN 서버를 사용하여 모든 정보를 전달하고, 서버가 모든 패킷을 중계하여 피어 간 통신을 가능하게 한다. 이 방식은 오버헤드가 발생하므로, 다른 대안이 없을 경우에만 사용된다.

  <img width="100%" alt="turn" src="https://github.com/user-attachments/assets/bf0cdac1-70a2-4b15-aed8-8e3a9cd4b191">

## 6. SDP

- SDP(Session Description Protocol)는 실시간 통신 시스템에서 세션 정보를 설명하고 교환하는 데 사용되는 텍스트 기반의 표준 포맷이다. 주로 WebRTC와 같은 P2P(피어 투 피어) 통신 시스템에서 사용되며, 미디어 세션에 대한 메타데이터(해상도, 형식, 코덱, 암호화 등)를 포함하여 두 엔드포인트 간의 세션 설정에 필요한 정보를 교환한다. 기술적으로는 프로토콜이 아닌 데이터 포맷으로, 디바이스 간 미디어 연결을 설명하는 데 사용된다.

# 5. WebRTC 프로세스 단계

## 1. 사용자 미디어 수집

- 사용자 미디어 컴포넌트는 웹캠이나 마이크와 같은 사용자 디바이스에서 오디오와 비디오를 캡처하여 미디어 스트림을 생성한다.

## 2. 시그널링

- WebRTC 통신에서 시그널링 서버는 두 피어 간의 실시간 오디오 및 비디오 연결을 위해 초기 정보(offer) 교환을 중개하는 역할을 한다. 시그널링은 두 브라우저(피어)가 연결을 설정하는 데 필요한 SDP(세션 설명 프로토콜) 요청 및 응답, 후보 IP 주소, 네트워크 상태, 코덱 및 프로토콜 협상, 세션 시작 및 종료 정보 등을 교환하는 과정이다.

- WebRTC는 특정 시그널링 프로토콜을 정의하지 않으므로, 개발자는 WebSocket, HTTP, XMPP, SIP 등 다양한 방법으로 시그널링을 구현할 수 있다. 시그널링 서버는 이를 통해 각 브라우저의 정보를 상대방에게 전달하며, 이를 바탕으로 peer-to-peer 연결이 설정된다. 연결이 완료되면 브라우저 간 실시간 미디어 데이터는 직접 전송되며, 서버는 이 과정에 관여하지 않는다. 즉, 시그널링 서버는 초기 연결 설정에 필요한 정보를 교환하는 중개자 역할만 수행한다. 결론적으로, 시그널링 서버는 피어 간의 초기 연결 설정을 지원하고, 이후 브라우저 간의 직접 통신 경로를 통해 실시간 데이터 전송이 가능해진다.

> ### 시그널링 프로세스
>
> 1. A 피어는 `createOffer()`를 호출해 Offer SDP를 생성하고, `setLocalDescription(offer)`으로 로컬 SDP를 설정한 뒤, 시그널링 서버를 통해 B 피어에게 전달한다.
> 2. A 피어는 ICE Candidate를 수집하고, `onicecandidate` 이벤트를 통해 수집된 ICE Candidate를 시그널링 서버를 통해 B 피어에게 전달한다.
> 3. B 피어는 전달받은 Offer SDP를 `setRemoteDescription(offer)`으로 설정해 A 피어의 SDP를 확인한다.
> 4. B 피어는 `createAnswer()`를 호출해 Answer SDP를 생성하고, `setLocalDescription(answer)`으로 로컬 SDP를 설정한 뒤, 이 SDP를 시그널링 서버를 통해 A 피어에게 전달한다.
> 5. B 피어는 ICE Candidate를 수집하고, `onicecandidate` 이벤트를 통해 수집된 ICE Candidate를 시그널링 서버를 통해 A 피어에게 전달한다.
> 6. A 피어는 전달받은 Answer SDP를 `setRemoteDescription(answer)`으로 설정해 B 피어의 SDP를 확인한다.
> 7. A 피어는 B 피어의 ICE Candidate를 수신하고, `addIceCandidate()`를 호출해 ICE Candidate를 추가한다.
> 8. B 피어는 A 피어의 ICE Candidate를 수신하고, `addIceCandidate()`를 호출해 ICE Candidate를 추가한다.
>
>    <img width="100%" alt="signaling" src="https://github.com/user-attachments/assets/c358659b-6bde-4c5d-a7c5-cf9f1863a310">
>
>    <img width="100%" alt="signaling" src="https://github.com/user-attachments/assets/aff6f92f-ad1a-4906-8913-1b2e03b91e31">

## 3. NAT 순회

- NAT 통과 구성 요소는 방화벽과 NAT 뒤에 있는 경우에도 ICE 및 TURN과 같은 기술을 사용하여 네트워크 제한을 극복하고 피어 간에 직접 연결을 설정한다.

## 4. 미디어 처리

- 미디어 처리 구성 요소는 오디오 및 비디오 스트림을 인코딩, 디코딩 처리하여 피어 간의 고품질 통신을 보장한다. 또한 에코 제거 및 지터 버퍼와 같은 기능을 관리하여 사용자 경험을 향상시킨다.

## 5. 피어 연결 설정

- 피어 연결 구성 요소는 미디어 기능의 협상을 관리하고 피어 간의 연결을 설정하며 피어 간의 미디어 스트림 흐름을 처리한다. 연결이 설정되면 사용자는 오디오, 비디오 및 데이터 채널을 통해 실시간으로 커뮤니케이션할 수 있다.

# 4. WebRTC의 Media Streams API

- Media Capture and Streams API(일명 MediaStream API)는 오디오와 비디오 데이터를 웹 환경에서 실시간 스트리밍할 수 있도록 지원하는 WebRTC 관련 API이다. 이 API는 미디어 스트림 자체와 이를 구성하는 각 오디오, 비디오 트랙을 관리하고, 트랙 품질이나 형식에 대한 제한(Constraints)을 설정할 수 있으며, 비동기적 데이터 활용을 위한 성공, 오류 콜백 및 다양한 이벤트 처리를 위한 인터페이스와 메서드를 제공한다. 이를 통해 브라우저에서 실시간 미디어를 캡처, 처리, 전송하는 기능을 유연하고 안전하게 구현할 수 있다.

- 아래 내용을 통해, WebRTC의 주요 구성 요소들은 다음과 같이 서로 연계된다.

  1. MediaDevices와 getUserMedia를 통해 로컬 기기의 카메라·마이크 스트림을 얻고

  2. MediaStream을 통해 이 미디어를 다루며

  3. RTCPeerConnection을 사용해 해당 스트림을 원격 피어에게 전송하거나 피어로부터 수신하고
  4. RTCDataChannel을 통해 추가적인 비미디어 데이터 교환이 가능해진다.

## 1. MediaDevices

- MediaDevices 인터페이스는 `navigator.mediaDevices`를 통해 접근할 수 있으며, 카메라, 마이크 공유 화면 등 현재 연결된 사용자의 미디어 입력 장치에 대한 접근을 제공한다. `getUserMedia()` 메서드를 통해 카메라/마이크 스트림을 요청할 수 있고, `enumerateDevices` 메서드를 사용하여 오디오 및 비디오 스트림 캡처를 위한 특정 장치에 대한 접근을 요청할 수 있다.

  > [MediaDevices MDN](https://developer.mozilla.org/ko/docs/Web/API/MediaDevices)

### 1-1. MediaDevices.getUserMedia()

- getUserMedia는 MediaDevices 인터페이스의 메서드로, 사용자의 오디오 및 비디오 입력 장치에 대한 접근을 요청하는 데 사용된다. 이 메서드는 사용자에게 마이크와 카메라에 접근할 수 있는 권한을 묻는 메시지를 표시하고 오디오 및 비디오 스트림이 포함된 MediaStream 객체를 반환한다. 반환된 MediaStream 객체는 비디오 태그나 RTCPeerConnection에 입력으로 활용 가능하다.

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

- enumerateDevices는 MediaDevices 인터페이스의 메서드로, 현재 시스템에 연결된 카메라, 마이크, 스피커 등 사용 가능한 오디오, 비디오 입출력 장치 목록을 조회하고, 해당 장치들의 정보를 담은 MediaDeviceInfo 객체 배열을 반환한다. 이 메서드는 장치 접근 권한을 직접 요청하지 않으며, 필요한 경우 getUserMedia를 통해 별도로 접근 권한을 획득할 수 있다.

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

## 2. MediaStream

- MediaStream 인터페이스는 WebRTC 세션에서 송수신되는 오디오 및 비디오 스트림을 나타내며, 이를 통해 사용자는 자신의 디바이스(카메라, 마이크)에서 캡처한 미디어에 접근할 수 있다. MediaStream 객체는 하나 이상의 오디오, 비디오 트랙을 포함할 수 있으며, 각 트랙은 MediaStreamTrack의 인스턴스로 저장된다. 이 트랙들을 전송하기 전에 적절히 조작, 처리함으로써 미디어 스트림을 원하는 형태로 커스터마이징할 수 있다.

  > [MediaStream MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)

### 2-1. MediaStream.getTracks()

- getTracks는 MediaStream 객체에 포함된 모든 오디오 및 비디오 트랙을 배열 형태로 반환하는 메서드로, 이를 통해 현재 스트림에 어떤 트랙들이 있는지 쉽게 파악하고 필요할 경우 특정 트랙을 조작하거나 제거할 수 있다. 반환된 MediaStreamTrack 배열을 활용하면 각 트랙에 대해 음소거(비활성화)하거나 해상도, 프레임레이트 등의 품질 설정을 변경하는 등 세밀한 제어가 가능하다.

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

### 2-2. MediaStream.getAudioTracks

- getAudioTracks는 MediaStream 객체에 포함된 모든 오디오 트랙을 배열 형태로 반환하는 메서드이다. 이 메서드는 장치 접근 권한을 별도로 요청하지 않으며, 이미 확보된 MediaStream 내에서만 호출할 수 있다. 반환된 트랙 배열을 활용하면 오디오 트랙을 활성화, 비활성화하거나, 필요한 경우 특정 오디오 트랙을 제거하는 등 개별 오디오 신호에 대한 세밀한 제어를 수행할 수 있다.

### 2-3. MediaStream.getVideoTracks

- getVideoTracks는 MediaStream 객체에 포함된 모든 비디오 트랙을 배열 형태로 반환하는 메서드이다. 이 메서드는 이미 획득한 MediaStream 내에서 호출 가능하며, 추가적인 장치 접근 권한 요청 없이 현재 보유하고 있는 비디오 트랙 정보에 접근할 수 있다. 반환된 비디오 트랙 배열을 활용하면 해상도, 프레임레이트, 밝기 등의 영상 품질 관련 설정을 조정하거나 특정 비디오 트랙을 제거하는 등, 개별 비디오 신호에 대한 정교한 관리와 제어를 수행할 수 있다.

## 3. MediaStreamTrack

- MediaStreamTrack은 미디어 스트림 객체 내의 개별 오디오 또는 비디오 트랙을 나타낸다. 트랙을 추가, 제거 또는 음소거하여 오디오 및 비디오 데이터의 흐름을 제어할 수 있다. 트랙의 종류(오디오 또는 비디오), 활성화 상태 및 제약 조건과 같은 미디어 스트림 트랙의 속성에 액세스할 수 있다.

  > [MediaStreamTrack MDN](https://developer.mozilla.org/ko/docs/Web/API/MediaStreamTrack)

### 3-1. MediaStreamTrack.stop()

- MediaStreamTrack.stop는 MediaStreamTrack 객체의 메서드로, 현재 캡처되거나 재생 중인 오디오 또는 비디오 트랙을 중지하는 데 사용된다. 이 메서드를 호출하면 해당 트랙은 더 이상 미디어 데이터를 생성하지 않으며, MediaStream에서도 유효한 트랙으로 인식되지 않는다.

  ```javascript
  const stopStreamedVideo = (videoElem) => {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());

    videoElem.srcObject = null;
  };
  ```

### 3-2. MediaStreamTrack.enabled

- MediaStreamTrack.enabled는 MediaStreamTrack 객체의 속성으로, 해당 트랙(오디오 혹은 비디오)이 활성화되어 있는지 여부를 나타내는 Boolean 값이다. 기본적으로 true로 설정되어 있으며, 이 값이 false로 변경되면 해당 트랙은 더 이상 오디오나 비디오 데이터를 전송하지 않아 "음소거" 상태와 유사한 동작을 하게 된다. 그러나 트랙 자체는 여전히 MediaStream에 포함되어 있어 재생 목록에서 제거되지 않으며, 언제든지 enabled 값을 다시 true로 되돌려 미디어 출력을 재개할 수 있다.

## 4. RTCPeerConnection

- RTCPeerConnection 인터페이스는 WebRTC 세션에서 두 피어 간 실시간 오디오, 비디오 및 데이터 전송을 위한 P2P 연결을 설정하고 관리하는 핵심 요소이다. 이를 통해 피어들은 네트워크를 통해 전달될 미디어 스트림 및 데이터 채널을 서로 교환할 수 있으며, 시그널링 과정을 통해 ICE 후보, SDP 등 필요한 연결 정보를 주고받는다. RTCPeerConnection을 활용하면 연결 과정에서 사용되는 코덱, 암호화 방식, 네트워크 환경 등을 협상할 수 있으며, 미디어 및 데이터 흐름을 원하는 형태로 관리하고 최적화함으로써 실시간 통신 환경을 유연하고 안정적으로 구성할 수 있다.

  > [RTCPeerConnection MDN](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection)

## 5. RTCDataChannel

- RTCDataChannel 인터페이스는 WebRTC를 통해 오디오나 비디오 스트림과는 별도로 텍스트, 파일, 바이너리 데이터와 같은 비미디어 데이터를 두 피어 간에 실시간으로 교환하기 위한 P2P 데이터 채널을 제공한다. 이를 통해 신뢰성과 순서 보장 여부 등을 설정하여 안정적이고 정교한 데이터 전송 방식을 구현할 수 있으며, 시그널링 과정을 통해 RTCPeerConnection 연결이 확립된 후 해당 데이터 채널을 생성·관리할 수 있다. RTCDataChannel을 활용하면 오디오, 비디오 스트림 전송과 함께 다양한 형태의 정보를 유연하고 효율적으로 공유함으로써 보다 풍부한 실시간 커뮤니케이션 경험을 제공할 수 있다.

  > [RTCDataChannel MDN](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel)
