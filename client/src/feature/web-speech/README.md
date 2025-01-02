# 1. Web Speech API란?

- Web Speech API는 `SpeechRecognition(STT)`과 `SpeechSynthesis(TTS)` 두 가지로 구성되어 있는 자바스크립트 API다. 별도의 플러그인이나 추가 소프트웨어 없이도 웹 애플리케이션에서 마이크로 음성을 입력받아 텍스트로 변환하거나, 텍스트를 음성으로 재생할 수 있어 음성 기반 상호작용을 간단히 구현할 수 있다. 다만, 브라우저 지원 범위가 제한적이므로 서비스 적용 전 호환성 여부를 확인해야 한다.

  > [MDN: Web Speech API](https://developer.mozilla.org/ko/docs/Web/API/Web_Speech_API)

# 2. SpeechRecognition

- SpeechRecognition은 Web Speech API의 한 구성 요소로, 웹 애플리케이션에서 **음성을 텍스트로 변환(Speech To Text)** 하는 기능을 제공하는 자바스크립트 API다.

  > [MDN: SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)

## 1. SpeechRecognition 동작 원리

### 1-1. SpeechRecognition 생성

- Web Speech API에서 SpeechRecognition(또는 webkitSpeechRecognition) 객체를 생성하면, 브라우저는 사용자의 마이크(오디오 입력)에 접근해 음성을 텍스트로 변환하는 과정을 진행할 수 있게 된다.

- 마이크 접근은 내부적으로 `getUserMedia`와 유사한 접근 권한 요청을 거친다.

  ```javascript
  // 1) 브라우저에서 SpeechRecognition을 지원하는지 확인
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('이 브라우저는 SpeechRecognition을 지원하지 않습니다.');
  } else {
    // 2) SpeechRecognition 객체 생성
    const recognition = new SpeechRecognition();

    // 3) 언어 설정
    recognition.lang = 'ko-KR';

    // 4) 음성 인식 시작
    recognition.start();
  }
  ```

### 1-2. 이벤트 기반 콜백 처리

- SpeechRecognition 객체는 사용자 음성 데이터가 들어오면, 이를 STT(Speech To Text) 엔진으로 전송해 인식 결과를 돌려받는다.

- 반환되는 인식 결과는 `onresult` 이벤트를 통해 받을 수 있으며, 중간(Interim Result)과 최종(Final Result)으로 나뉜다.

  ```javascript
  // 1) SpeechRecognition 객체 생성
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // 2) onresult: 음성 인식 엔진으로부터 중간/최종 텍스트가 반환되면 호출된다.
  recognition.onresult = (e) => {
    // 가장 최근 결과 인덱스
    const current = e.resultIndex;
    // 해당 결과(중간/최종)에 대한 transcript
    const transcript = e.results[current][0].transcript;

    console.log('인식된 텍스트:', transcript);
  };

  // 3) onerror: 네트워크 문제, 권한 거부 등 오류가 발생하면 호출된다.
  recognition.onerror = (e) => {
    console.error('SpeechRecognition 오류:', e.error);
  };

  // 4) 음성 인식 시작
  recognition.start();
  ```

### 1-3. 연속 인식(continuous), 중간 인식(interimResults)

- `continuous = true`로 설정하면, 사용자가 명시적으로 `stop()`을 호출하지 않는 한 계속 음성 인식을 진행한다.

- `interimResults = true`로 설정하면, 확정되지 않은 중간 인식 결과(Interim Result)도 함께 반환하므로, 실시간 자막처럼 중간 텍스트를 확인할 수 있다.

- `isFinal` 속성을 사용해 해당 결과가 최종인지(정말 확정된 텍스트인지) 구분할 수 있다.

  ```javascript
  // 1) SpeechRecognition 객체 생성
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // 2) 옵션 설정
  recognition.continuous = true; // 연속 모드
  recognition.interimResults = true; // 중간 결과 표시

  recognition.lang = 'ko-KR';

  // 3) 이벤트 콜백
  recognition.onresult = (event) => {
    // 모든 결과를 순회하며 중간/최종 텍스트를 구분할 수 있다.
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const { transcript } = e.results[i][0];

      if (result.isFinal) {
        // 최종(Final) 결과
        console.log('[최종 결과]:', transcript);
      } else {
        // 중간(Interim) 결과
        console.log('(중간 결과):', transcript);
      }
    }
  };

  // 4) 연속 인식 중단 시점(선택적으로 onend에서 재시작 가능)
  recognition.onend = () => {
    console.log('인식이 종료되었습니다.');
    // 재시작
    // recognition.start();
  };

  // 5) 음성 인식 시작
  recognition.start();
  ```

## 2. SpeechRecognition 주요 메서드 및 이벤트

### 2-1. 메서드

#### 1. start()

- 음성 인식을 시작한다. 마이크 권한을 요청하고, 연속 모드인 경우 사용자가 명시적으로 중단할 때까지 계속 인식한다.

#### 2. stop()

- 음성 인식을 중단한다. `continuous`가 `true`인 경우에도 강제로 종료합니다.

#### 3. abort()

- `stop()`과 유사하지만, 현재 진행 중인 인식이 취소 상태로 종료된다.

### 2-2. 이벤트

#### 1. onresult

- 음성 인식 결과가 반환될 때마다 호출된다. `event.results` 배열을 통해 n번째 중간/최종 결과에 접근할 수 있다.

#### 2. onend

- 음성 인식이 종료될 때마다 호출된다. `continuous = true` 상태에서 인식된 음성이 없어 종료된 경우, 재시작하려면 이 이벤트에서 `recognition.start()`를 재호출할 수 있다.

#### 3. onerror

- 네트워크 에러, 권한 거부 등 다양한 오류 상황에서 호출된다.
