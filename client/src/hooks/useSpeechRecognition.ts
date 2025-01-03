import { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  resultIndex: number;
  results: SpeechRecognitionResult[];
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionResultList) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export const useSpeechRecognition = (isActive: boolean) => {
  const [transcript, setTranscript] = useState<string>('');

  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    //@ts-expect-error window.SpeechRecognition is not defined
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    recognition.current = new SpeechRecognition();

    if (recognition.current) {
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'ko-KR';

      recognition.current.onresult = (e: SpeechRecognitionResultList) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const { transcript } = e.results[i][0];
          if (e.results[i].isFinal) setTranscript((prev) => prev + transcript);
        }
      };

      recognition.current.onend = () => {
        if (isActive && recognition.current) recognition.current.start();
      };
    }
  }, [isActive]);

  const startSpeechRecognition = () => {
    // speech recognition api는 내부적으로 getUserMedia를 사용하여 마이크 접근을 처리하고,
    // 마이크 권한을 요청한다.
    if (recognition.current) {
      setTranscript('');
      recognition.current.start();
    }
  };

  const stopSpeechRecognition = () => {
    if (recognition.current) recognition.current.stop();
  };

  return { transcript, startSpeechRecognition, stopSpeechRecognition };
};

// SpeechRecognition: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
