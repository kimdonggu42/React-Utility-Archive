# 1. Intersection Observer API란?

- Intersection Observer API는 웹 애플리케이션에서 특정 요소가 다른 요소와 교차할 때(화면에 표시될 때) 또는 특정 조건을 만족할 때 알림을 받을 수 있게 해주는 자바스크립트 API다. 이 API를 사용하면 스크롤이나 레이아웃 변경에 따라 발생하는 이벤트를 효율적으로 처리할 수 있어 성능을 최적화할 수 있다.

- 예를 들어, 이미지를 지연 로딩하거나, 애니메이션을 트리거하거나, 무한 스크롤 기능을 구현하는 데 유용하다. Intersection Observer는 브라우저의 레이아웃 엔진과 결합하여 이벤트 리스너 대신 동작하므로 성능 저하를 최소화할 수 있다.

> [IntersectionObserver: Web Speech API](https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API)

# 2. useIntersectionObserver 훅

- 이 커스텀 훅은 무한 스크롤 기능을 구현하는 데 사용된다. IntersectionObserver를 활용하여 지정된 DOM 요소가 뷰포트에 들어오면, 주어진 콜백 함수를 호출하여 추가 데이터를 로드하는 방식으로 동작한다.

## 1. 사용법

1. `useInfiniteScroll` 훅을 호출하여 초기화한다.
2. 반환된 `targetRef`를 무한 스크롤을 트리거할 요소에 ref로 연결하고, 해당 요소가 화면에 보일 때 실행할 콜백 함수를 전달한다.

   ```javascript
   const targetRef = useInfiniteScroll(() => {
     getPosts();
   });
   ```

## 2. 실행 흐름

### 1. IntersectionObserver 초기화

- `useIntersectionObserver` 훅이 실행되면, `IntersectionObserver`가 생성되고, `handleIntersect` 함수가 교차 감지 이벤트를 처리한다. `IntersectionObserver는` 지정된 `targetRef` 요소가 뷰포트에 들어오면 콜백을 호출한다. 콜백 함수는 `entries` 배열(여러 요소를 동시에 감지할 수 있기 때문)을 인자로 받으며, 각 항목의 `isIntersecting` 속성(특정 요소가 지정된 뷰포트나 대상으로 정의된 영역과 교차했는지 여부)으로 요소가 교차 상태인지 여부를 확인한다.

### 2. 데이터 로드 트리거

- 요소가 뷰포트에 들어오면, 콜백 함수에서 데이터를 로드하는 `getPosts` 함수가 호출된다. 무한 스크롤이 활성화되면 데이터를 모두 로드할 때까지 요소가 계속 감지되고 새로운 데이터가 로드된다.

### 3. IntersectionObserver 종료

- 컴포넌트가 언마운트되거나 `useEffect`의 반환 함수가 호출되면, `IntersectionObserver`는 감지 대상 요소에 대한 관찰을 중지한다.

## 3. 주요 설정

- **root**: 교차 상태를 감지할 뷰포트나 요소를 지정한다. 기본값은 null로, 이는 브라우저 뷰포트를 의미한다.

- **rootMargin**: 뷰포트 주변에 여유를 두는 마진 값을 설정한다. 예를 들어, 0px은 뷰포트 경계에 딱 맞게 감지하며, -50px과 같은 값을 설정하면 뷰포트보다 조금 더 일찍 감지할 수 있다.

- **threshold**: 감지 대상이 뷰포트에 얼마나 들어왔을 때 콜백을 실행할지 설정한다. 예를 들어, 1.0은 요소가 100% 뷰포트에 들어올 때만 콜백이 호출된다.
