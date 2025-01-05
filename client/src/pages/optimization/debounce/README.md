# 1. 디바운스란?

- 디바운스는 짧은 시간 간격으로 연속해서 발생하는 이벤트를 그룹화하여 과도한 이벤트 핸들러 호출을 방지하는 프로그래밍 기법으로, 이벤트 핸들러가 마지막으로 호출된 시점으로부터 일정 시간(delay)이 경과한 이후에 한 번만 호출되도록 동작한다.

# 2. useDebounce 훅

- 이 커스텀 훅은 이벤트가 연속적으로 발생할 때마다 지정된 지연 시간 이후에만 콜백 함수가 호출되도록 한다.

## 1. 사용법

1. `useDebounce` 훅을 호출하여 초기화한다.
2. 반환된 함수를 사용하여 지연 시간(delay)과 이 지연 시간 이후 실행될 콜백 함수(callback)를 지정한다.

   ```javascript
   const debounce = useDebounce(); // 1
   debounce(callback, delay); // 2
   ```

## 2. 실행 흐름

### 1. 최초 디바운스 트리거

- `useDebounce` 훅을 처음 실행할 때, `timerId`는 `null`로 초기화된다. 이 상태에서 디바운스가 처음으로 트리거되면, `timerId.current`가 `null`이므로 `clearTimeout`을 건너뛰고 새로운 타이머를 설정한다. 이때 `setTimeout(callback, delay)`가 실행되어 `timerId.current`는 새로운 타이머 Id를 가진다.

### 2. 디바운스가 다시 트리거될 때

- 디바운스가 설정한 `delay` 시간보다 짧은 간격으로 다시 트리거되면, `timerId.current`가 `null`이 아니기 때문에 `clearTimeout(timerId.current)`를 호출하여 이전에 설정한 타이머를 취소한다. 그 후, `timerId.current = setTimeout(callback, delay)` 코드가 실행되어 새로운 타이머가 설정된다.

### 3. 설정된 지연 시간 후 콜백 실행

- 디바운스가 트리거된 후 `delay` 시간이 지나면, `setTimeout`에 의해 지정된 `callback` 함수가 실행된다. 이후 새로운 이벤트가 발생할 때마다 이전과 같은 과정이 반복되며, 이전 타이머는 취소되고 새로운 타이머가 설정된다.

## 3. timerId 타입 지정 이슈

- useRef를 사용해 `number | null` 타입으로 설정한 timerId에 `timerId.current = setTimeout(callback, delay)`와 같이 Timeout 객체를 할당할 때 타입 오류가 발생한다.

  ```
  Type 'Timeout' is not assignable to type 'number'
  ```

- setTimeout 함수는 생성된 타이머를 식별할 수 있는 고유한 타이머 id를 반환한다. setTimeout 함수가 반환한 타이머 id는 **브라우저 환경인 경우 숫자**이며 **Node.js 환경인 경우 객체**다.

- 브라우저 환경에서 `setTimeout`과 `clearTimeout`은 전역 객체인 `window`에 포함되어 있어, `window.setTimeout`과 `window.clearTimeout`을 명시적으로 사용할 수 있다. 이때, `window.setTimeout`의 반환 값은 `number`로 정의되어 있으므로, `window.setTimeout(callback, delay)`는 `number`를 반환하고, `timerId.current`도 `number` 타입으로 설정된다. 따라서 `window`를 명시적으로 사용하면 반환 값을 `number`로 처리할 수 있다.

- 또한 `React.RefObject<T>`는 읽기 전용 참조 객체로, current 값을 변경하지 않고 DOM 참조 등에 사용되며, `React.MutableRefObject<T>`는 읽기/쓰기 가능한 참조 객체로 값을 변경할 수 있는 경우에 사용되어, `current` 값을 자유롭게 수정할 수 있다.
