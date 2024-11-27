웹 오디오의 일반적인 작업 흐름

1. 오디오 컨텍스트를 생성한다.

```javascript
const audioContext = new AudioContext();
```

2. 컨텍스트 내에서 소스(Inputs)를 생성한다.(ex: `<audio>` 태그, 스트림 등)

```javascript
// mediaStreamAudioSourceNode는 마이크나 기타 미디어 장치로부터 오디오 스트림을 받아오는 노드다.
const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStream);
```

3. 오디오 효과 적용을 위한 이펙트 노드(Effects)를 생성한다. (ex: 잔향 효과, 바이쿼드 필터, 패너, 컴프레서 등)

```javascript
const analyserNode = audioContext.createAnalyser();

const gainNode = audioCtx.createGain();
```

4. 오디오의 최종 목적지(Destination)를 선택한다. (ex: 시스템 스피커)
5. 사운드를 이펙트에 연결하고, 이펙트를 목적지에 연결(connection)한다.

```javascript
// mediaStreamAudioSourceNode와 analyserNode를 연결하여 분석만 수행
mediaStreamAudioSourceNode.connect(analyserNode);

// mediaStreamAudioSourceNode와 gainNode를 연결하여 오디오 볼륨을 조절하고, 오디오 출력 장치로도 전송
// audioContext.destination은 기본 출력 장치(스피커나 헤드폰 등)로, 오디오가 실제로 재생되는 곳입니다.
mediaStreamAudioSourceNode.connect(gainNode);
gainNode.connect(audioContext.destination);
```
