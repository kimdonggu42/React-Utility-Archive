# React Utility Library

- 이 레포지토리는 학습과 기록, 재사용을 목적으로 만들어졌으며, React 애플리케이션 개발 시 자주 사용되는 커스텀 훅, UI 컴포넌트, Web API를 활용한 간단한 샘플 앱 등 다양한 템플릿들을 모아놓은 레포지토리입니다. 반복적으로 구현해야 하는 공통 기능들을 재사용 가능한 형태로 정리하여 개발 생산성을 높이고 코드 품질을 개선하는 것을 목표로 하며, 주기적으로 개선 작업을 진행하고 있습니다.

## 목차

#### 1. [설치 및 실행](#1-설치-및-실행)

#### 2. [폴더 구조](#2-폴더-구조)

#### 3. [특징](#3-특징)

#### 4. [예제](#4-템플릿-예제)

## 1. 설치 및 실행

```bash
// 프론트엔드 실행
cd client
npm install
npm run dev

// 백엔드 실행
cd server
npm install
npm run websocket // npm run + 실행하고자 하는 디렉토리명
```

## 2. 폴더 구조

```
react-template/
├─ client/                          # 프론트엔드 코드
│  ├─ public/                       # 정적 파일
│  ├─ src/                          # 소스 코드
│  │  ├─ assets/                    # 이미지, 폰트 등 정적 파일
│  │  ├─ feature/                   # 주요 기능별 모듈화된 폴더
│  │  │  ├─ debounce/               # 디바운스
│  │  │  ├─ infinite-scroll/        # 무한 스크롤
│  │  │  ├─ modal/                  # 모달
│  │  │  ├─ pagination/             # 페이지네이션
│  │  │  ├─ socketio/               # Socket.IO를 활용한 통신
│  │  │  ├─ speech-recognition/     # 음성 인식(Speech To Text)
│  │  │  ├─ throttle/               # Throttle
│  │  │  ├─ web-audio-api/          # 오디오 API 처리
│  │  │  ├─ web-rtc/                # WebRTC 관련 기능
│  │  │  └─ websocket/              # WebSocket 통신
│  │  ├─ mocks/                     # Mock 데이터(MSW)
│  │  ├─ routes/                    # 라우팅 설정
│  │  ├─ types/                     # 타입스크립트 타입 정의
│  │  ├─ app.tsx                    # 메인 React 컴포넌트
│  │  ├─ main.tsx                   # React 진입점
│  │  ├─ index.css                  # 전역 스타일
│  │  └─ vite-env.d.ts              # Vite 환경 설정 타입 정의
│  ├─ index.html                    # 메인 HTML 파일
│  ├─ package.json                  # 프로젝트 의존성 설정
│  ├─ vite.config.ts                # Vite 설정 파일
│  ├─ tailwind.config.js            # Tailwind CSS 설정
│  ├─ tsconfig.json                 # TypeScript 설정
│  └─ README.md                     # 프로젝트 설명
│
└─ server/                          # 백엔드 코드
   ├─ node_modules/                 # 서버 의존성
   ├─ socketio/                     # Socket.IO 서버
   ├─ webrtc/                       # WebRTC 서버 로직
   ├─ websocket/                    # WebSocket 서버
   ├─ .eslintrc.json                # ESLint 설정
   └─ .prettier.json                # Prettier 코드 스타일 설정
```

## 3. 특징

- Client: 프론트엔드 코드로, React 기반으로 구성되어 있으며 화면 UI와 기능 구현을 담당합니다.

- Server: 백엔드 코드로, 실시간 통신(WebSocket, WebRTC 등)과 데이터 처리를 지원합니다.

### Client의 기능별 정리(Feature 디렉토리)

- feature의 각 디렉토리 별로 간단히 테스트 해 볼 수 있는 page 컴포넌트가 존재 합니다.

  - **Debounce**: 입력 지연을 제어하여 성능 최적화

  - **Throttle**: 이벤트 발생 빈도를 제어하여 성능 개선

  - **Infinite Scroll**: 스크롤 기반 동적 데이터 로딩

  - **Modal**: 재사용 가능한 모달 UI 컴포넌트

  - **Pagination**: 페이지네이션 UI 컴포넌트

  - **Speech Recognition**: 음성을 텍스트로 변환하는 음성 인식 기능

  - **Web Audio API**: 오디오 데이터의 스트림 제어 및 분석

  - **WebSocket**: 양방향 실시간 통신

  - **Socket.IO**: 이벤트 기반 실시간 통신

  - **WebRTC**: P2P 오디오, 비디오 및 데이터 전송

### Server의 실시간 통신 지원

- WebSocket과 Socket.IO를 통해 실시간 양방향 데이터 전송을 지원합니다.

- WebRTC 서버 구현을 통해 클라이언트 간 P2P 연결을 위한 신호 교환(Signaling)을 처리합니다.

## 4. 템플릿 예제

### 디바운스 커스텀 훅 (useDebounce.ts)

- 짧은 시간 간격으로 이벤트가 연속해서 발생하면, 마지막 이벤트 발생 후 일정 시간(delay)이 지난 후에만 콜백을 실행하는 디바운스 기능을 구현한 커스텀 훅입니다.

- 실시간으로 빠르게 발생하는 이벤트를 최적화할 때 유용합니다.

- useDebounce를 호출해 디바운스 함수를 생성하고, 이벤트 핸들러에서 콜백 함수와 딜레이(ms)를 전달하여 디바운스를 적용합니다.

  ```javascript
  const debounce = useDebounce();

  debounce(() => {
    console.log("디바운스 콜백 실행");
  }, 2000);
  ```

### 디바운스를 테스트할 수 있는 컴포넌트 (DebouncePage.tsx)

- 입력 필드에 텍스트를 입력할 때, 입력이 끝난 후 일정 시간 동안 대기한 뒤에만 콜백(알림 메시지)이 실행되는 예제입니다.

- 입력 필드에서 이벤트 연속 발생 시 디바운스 처리. 마지막 입력 후 2초가 경과하면 알림(alert)을 실행합니다.

  ```javascript
  import { useState } from "react";
  import { useDebounce } from "@/feature/debounce/useDebounce";

  export default function DebouncePage() {
    const [text, setText] = useState < string > "";

    const debounce = useDebounce();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
      debounce(() => {
        alert("마지막으로 입력한지 2초가 지났습니다!");
      }, 2000);
    };

    return (
      <div className='flex h-screen items-center justify-center'>
        <input className='border border-black' value={text} onChange={handleInputChange} />
      </div>
    );
  }
  ```
