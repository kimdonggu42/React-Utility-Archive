import { useState, useRef } from 'react';

export default function AudioVisualizerPage() {
  const [isActive, setIsActive] = useState<boolean>(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const toggleVisualization = async () => {
    if (isActive) {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);

      if (audioContextRef.current) audioContextRef.current.close();

      if (mediaStreamRef.current) {
        const tracks = mediaStreamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }

      setIsActive(false);
    } else {
      try {
        // getUserMedia로 마이크에 접근하여 사용자의 마이크로부터 얻은 오디오 트랙을 포함하고 있는 MediaStream(mediaStream) 생성
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = mediaStream;

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        // AudioContext의 createAnalyser를 사용하여, 주파수를 시각화 할 수 있는 AnalyserNode(analyserNode) 생성
        const analyserNode = audioContextRef.current.createAnalyser();
        analyserNodeRef.current = analyserNode;

        // createMediaStreamSource는 Web Audio API에서 제공하는 메서드로,
        // 미디어 스트림(예: 사용자 마이크나 카메라에서 받은 오디오/비디오 스트림)을 AudioContext에 연결하여,
        // 해당 스트림의 오디오 데이터를 Web Audio API에서 처리할 수 있도록 해줌

        // MediaStream(mediaStream)을 오디오 처리 그래프에 연결할 수 있는 MediaStreamAudioSourceNode(mediaStreamAudioSourceNode) 생성
        const mediaStreamAudioSourceNode =
          audioContextRef.current.createMediaStreamSource(mediaStream);
        mediaStreamAudioSourceNode.connect(analyserNodeRef.current);

        // fftSize: AnalyserNode에서 주파수 분석을 위해 사용할 FFT(빠른 푸리에 변환) 크기를 설정하는 속성,
        // 기본값은 2048이며, fftSize가 클수록 더 정확한 주파수 분석을 제공하지만, 성능에 영향을 미칠 수 있음
        analyserNodeRef.current.fftSize = 2048;
        // frequencyBinCount: frequencyBinCount는 AnalyserNode가 제공하는 주파수 대역의 개수를 반환한다.
        // 이 값은 fftSize 값을 기반으로 계산된다. 예를 들어, fftSize가 2048 frequencyBinCount는 1024.
        // 주파수 분석을 수행할 때, 이 값만큼의 주파수 대역에 대한 데이터를 가져올 수 있다.
        const { frequencyBinCount } = analyserNodeRef.current;
        const frequencyDataArray = new Uint8Array(frequencyBinCount);

        const canvas = canvasRef.current;
        let canvasContext: CanvasRenderingContext2D | null = null;

        const render = () => {
          if (canvas) {
            canvasContext = canvasContext || canvas.getContext('2d');

            if (canvasContext && analyserNodeRef.current) {
              // getByteFrequencyData: AnalyserNode에서 주파수 분석 결과를 가져오는 메서드다.
              // 이 메서드는 오디오 신호의 주파수 영역 데이터를 Uint8Array 형식으로 반환한다.
              // 각 배열의 값은 해당 주파수 대역의 진폭을 나타내며, 값의 범위는 0~255로, 0은 신호가 없음을, 255는 신호가 최대임을 나타낸다.
              analyserNodeRef.current.getByteFrequencyData(frequencyDataArray);

              canvasContext.fillStyle = '#ffffff';
              canvasContext.fillRect(0, 0, canvas.width, canvas.height);

              canvasContext.lineWidth = 2;
              canvasContext.strokeStyle = '#000000';

              const barWidth = 10;
              let x = 0;

              for (let i = 0; i < frequencyBinCount; i++) {
                const amplitude = frequencyDataArray[i];
                const height = (amplitude * canvas.height) / 256;
                canvasContext.fillStyle = `#000000`;
                canvasContext.fillRect(x, canvas.height - height, barWidth, height);

                x += barWidth + 1;
              }
            }
          }

          animationFrameIdRef.current = requestAnimationFrame(render);
        };

        render();

        setIsActive(true);
      } catch (error) {
        console.error('마이크에 접근할 수 없습니다:', error);
      }
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
              {isActive ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
