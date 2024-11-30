import { useState, useRef } from 'react';

const visualizeAudio = (
  clientAnimationFrameId: number | null,
  clientCanvas: HTMLCanvasElement | null,
  analyserNode: AnalyserNode,
  barWidth: number,
  barSpacing: number,
  barColor: string,
) => {
  clientAnimationFrameId = requestAnimationFrame(() =>
    visualizeAudio(
      clientAnimationFrameId,
      clientCanvas,
      analyserNode,
      barWidth,
      barSpacing,
      barColor,
    ),
  );

  // frequencyBinCount: frequencyBinCount는 AnalyserNode가 제공하는 주파수 대역의 개수를 반환한다.
  // 이 값은 fftSize 값을 기반으로 계산된다. 예를 들어, fftSize가 2048 frequencyBinCount는 1024.
  // 주파수 분석을 수행할 때, 이 값만큼의 주파수 대역에 대한 데이터를 가져올 수 있다.
  const bufferLength = analyserNode.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  if (clientCanvas) {
    const clientCanvasCtx = clientCanvas.getContext('2d');

    if (clientCanvasCtx) {
      analyserNode.getByteFrequencyData(dataArray);

      clientCanvasCtx.fillStyle = '#ffffff';
      clientCanvasCtx.fillRect(0, 0, clientCanvas.width, clientCanvas.height);

      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const amplitude = dataArray[i];
        const height = (amplitude * clientCanvas.height) / 256;
        clientCanvasCtx.fillStyle = barColor;
        clientCanvasCtx.fillRect(x, clientCanvas.height - height, barWidth, height);

        x += barWidth + barSpacing;
      }
    }
  }
};

export default function AudioVisualizerPage() {
  const [isProcessingAudio, setIsProcessingAudio] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaStreamAudioSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const startAudioProcessing = async () => {
    try {
      // 1. getUserMedia로 마이크 오디오 가져오기
      // getUserMedia로 마이크에 접근하여 사용자의 마이크로부터 얻은 오디오 트랙을 포함하고 있는 MediaStream을 생성한다.
      // 이 메서드는 사용자의 미디어 장치(마이크 또는 카메라)에서 데이터를 가져오는 역할을 함
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = mediaStream;

      // 2. Audiocontext 생성
      // 오디오 처리를 위해 여러 노드를 연결하고 제어하는 AudioContext 생성
      // AudioContext 내에서는 각각의 AudioNode 들로 소리를 제어한다.
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // 3. MediaStreamAudioSourceNode로 오디오 소스 생성
      // audioContext.createMediaStreamSource()는 mediaStream을 입력으로 받아서, 이를 AudioNode로 변환한다.
      // 이렇게 변환된 mediaStreamAudioSourceNode는 audioContext에서 처리할 수 있는 오디오 소스로 사용된다.
      const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStream);
      mediaStreamAudioSourceNodeRef.current = mediaStreamAudioSourceNode;

      // 4. 오디오 분석 노드 생성
      // AudioContext의 createAnalyser를 사용하여, 주파수를 시각화 할 수 있는 AnalyserNode 생성
      // AnalyserNode는 오디오 데이터를 분석하고, 이를 시각화하거나 다른 처리에 활용할 수 있게 해주는 노드이다.
      const analyserNode = audioContext.createAnalyser();
      // fftSize: AnalyserNode에서 주파수 분석을 위해 사용할 FFT(빠른 푸리에 변환) 크기를 설정하는 속성,
      // 기본값은 2048이며, fftSize가 클수록 더 정확한 주파수 분석을 제공하지만, 성능에 영향을 미칠 수 있음
      analyserNode.fftSize = 2048;
      analyserNodeRef.current = analyserNode;
      // 이제 MediaStreamAudioSourceNode를 AnalyserNode에 연결하여, 오디오 데이터를 분석할 수 있도록 설정한다.
      // 즉, MediaStreamAudioSourceNode는 마이크에서 받은 실시간 오디오 데이터를 가져오고,
      // AnalyserNode는 그 데이터를 실시간으로 분석하여, 주파수 정보 등을 얻을 수 있게 된다.
      mediaStreamAudioSourceNode.connect(analyserNode);

      // 5. 오디오 시각화 실행
      visualizeAudio(
        animationFrameIdRef.current,
        canvasRef.current,
        analyserNode,
        10,
        1,
        '#0099ff',
      );

      setIsProcessingAudio(true);
    } catch (error) {
      console.error('마이크에 접근할 수 없습니다:', error);
    }
  };

  const stopAudioProcessing = () => {
    if (audioContextRef.current) audioContextRef.current.close();

    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      mediaStreamRef.current === null;
    }

    if (mediaStreamAudioSourceNodeRef.current) {
      mediaStreamAudioSourceNodeRef.current.disconnect();
      mediaStreamAudioSourceNodeRef.current === null;
    }

    if (analyserNodeRef.current) {
      analyserNodeRef.current.disconnect();
      analyserNodeRef.current = null;
    }

    if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);

    setIsProcessingAudio(false);
  };

  const toggleVisualization = async () => {
    if (isProcessingAudio) {
      stopAudioProcessing();
    } else {
      startAudioProcessing();
    }
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='flex justify-center'>
        <div className='flex flex-col items-center'>
          <h1 className='font-semibold'>Audio Visualizer</h1>
          <div className='flex flex-col items-center gap-y-5'>
            <canvas ref={canvasRef} />
            <button
              className='w-full rounded bg-slate-950 px-2 py-1 font-semibold text-white hover:bg-slate-800'
              onClick={toggleVisualization}
            >
              {isProcessingAudio ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Web Audio API로 시각화하기: https://developer.mozilla.org/ko/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
