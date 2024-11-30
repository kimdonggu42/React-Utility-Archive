# 1. 웹 오디오의 개념

- Web Audio API는 오디오를 동적으로 생성하고 처리하는 도구로, 여러 가지 노드를 연결하여 오디오의 흐름을 관리하고, 이펙트를 추가하거나 소리를 출력할 수 있게 해준다. 오디오 노드는 입력과 출력을 통해 서로 연결되어 오디오 그래프를 형성하고, 다양한 소스에서 오디오를 생성한다. 예를 들어, AudioBufferSourceNode나 MediaStreamAudioSourceNode는 사운드 파일이나 스트림을 처리하며, MediaStreamAudioSourceNode와 같은 오디오 스트림일 수 있다.

- 오디오 노드는 입력을 통해 사운드를 조정하거나 변형할 수 있으며, GainNode와 같은 이펙트 노드를 사용해 볼륨을 조정하는 등 여러 처리가 가능하다. 마지막으로, 오디오가 처리된 후 AudioContext.destination에 연결되어 스피커나 헤드폰으로 출력된다.

# 2. 웹 오디오의 일반적인 작업 흐름

### 1. 오디오 컨텍스트 생성

- 오디오 컨텍스트(Audio Context)는 오디오 작업을 처리하는 기본 단위다. 이 컨텍스트는 오디오 노드들을 연결하고 제어하는 역할을 한다.

  ```javascript
  const audioContext = new AudioContext();
  ```

### 2. 컨텍스트 내에 소스 노드 생성

- 소스 노드(Inputs)는 오디오의 출발점이 되는 노드다. 예를 들어, OscillatorNode는 기본적인 음파를 생성하고, AudioBufferSourceNode는 미리 저장된 오디오 파일을 재생한다. 또한, `<audio>` 태그는 HTML에서 오디오 파일을 재생할 수 있게 해주며, MediaStreamAudioSourceNode는 마이크나 다른 미디어 스트림에서 실시간으로 오디오를 입력받아 처리할 수 있다.

  ```javascript
  // mediaStreamAudioSourceNode는 마이크나 기타 미디어 장치로부터 오디오 스트림을 받아오는 노드다.
  const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStream);
  ```

### 3. 이팩트 노드 생성

- 오디오의 소리 변형이나 효과를 추가하기 위해 이펙트 노드(Effects)를 생성한다. 예를 들어, GainNode (볼륨 조정), AnalyserNode (주파수 분석), AudioWorkletNode (커스텀 오디오 처리) 등이 있다.

  ```javascript
  const analyserNode = audioContext.createAnalyser();

  const gainNode = audioCtx.createGain();
  ```

### 4. 오디오의 최종 목적지 선택

- 오디오의 최종 출력 지점인 목적지(Destination)를 선택한다. 이는 보통 AudioContext.destination으로 설정되어 스피커나 헤드폰을 의미한다.

### 5. 노드 연결

- 소스 노드(사운드)를 이펙트 노드에 연결(connection)하고, 이펙트 노드를 최종 출력 목적지에 연결하여 오디오 흐름을 형성한다. 이렇게 연결된 노드는 오디오 데이터를 처리하고 최종적으로 사용자에게 들려지게 된다.

  ```javascript
  // mediaStreamAudioSourceNode와 analyserNode를 연결하여 분석만 수행
  mediaStreamAudioSourceNode.connect(analyserNode);

  // mediaStreamAudioSourceNode와 gainNode를 연결하여 오디오 볼륨을 조절하고, 오디오 출력 장치로도 전송
  // audioContext.destination은 기본 출력 장치(스피커나 헤드폰 등)로, 오디오가 실제로 재생되는 곳이다.
  mediaStreamAudioSourceNode.connect(gainNode);
  gainNode.connect(audioContext.destination);
  ```

    <img width="100%" alt="웹 오디오 작업 흐름" src="https://github.com/user-attachments/assets/af356f38-604f-443f-a66e-b7d5305c9394">
