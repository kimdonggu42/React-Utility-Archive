import { useState, useEffect, useRef } from 'react';

const totalBars = 12;
const barWidth = 15;
const barSpacing = 10;
const clientBarColor = '#60a5fa';

export default function AudioVisualizerPage() {
  const [isAudioRecording, setIsAudioRecording] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaStreamAudioSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const visualizeClientAudio = () => {
      if (!isAudioRecording || !analyserNodeRef.current || !canvasRef.current) return;

      const analyserNode = analyserNodeRef.current;
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');

      if (canvasCtx) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        // frequencyDataLength는 오디오 주파수 데이터(audioFrequencyData) 배열의 길이다.
        // 오디오 데이터를 분석할 때, FFT는 입력 신호를 여러 개의 주파수 구간(빈)으로 나누는데 frequencyBinCount는 이러한 구간(빈)의 개수를 나타낸다.
        // frequencyBinCount는 fftSize의 절반이다. FFT는 대칭적으로 결과를 반환하기 때문에, 실제 의미 있는 데이터는 절반만 필요하다. 그래서 나머지 절반은 중복된 값이므로 분석에 사용되지 않는다.
        const frequencyDataLength = analyserNode.frequencyBinCount; // 1024
        // audioFrequencyData는 오디오 주파수 데이터(audioFrequencyData) 배열이다.
        const audioFrequencyData = new Uint8Array(frequencyDataLength);
        // getByteFrequencyData는 오디오의 주파수 데이터를 audioFrequencyData 배열에 저장한다.
        // 각 인덱스는 특정 주파수 구간을 의미하고, 값(0~255)은 해당 주파수 구간의 진폭(음량)을 나타낸다.
        analyserNode.getByteFrequencyData(audioFrequencyData);

        // groupSize는 오디오 주파수 데이터(audioFrequencyData)를 막대 수(totalBars)에 맞게 그룹화할 크기이다. (ex: 배열 길이가 1024고 막대가 12개라면 groupSize = 1024 / 12 = 85)
        const groupSize = Math.floor(frequencyDataLength / totalBars);

        // 주파수 그룹별 평균 계산, 막대 하나당 여러 개의 주파수 데이터를 하나의 주파수 데이터 그룹으로 압축한다.
        for (let i = 0; i < totalBars; i++) {
          // 각 그룹의 평균값 계산
          const groupStartIndex = i * groupSize;
          const groupEndIndex = groupStartIndex + groupSize;
          let groupDataSum = 0;

          for (let j = groupStartIndex; j < groupEndIndex; j++) {
            groupDataSum += audioFrequencyData[j];
          }

          const groupAmplitudeAverage = groupDataSum / groupSize;
          // normalizedBarHeight은 한 그룹의 오디오 데이터들의 평균값을 캔버스 높이에 비례하여 변환한 원래 막대의 높이 값이다.
          // 오디오 데이터는 0~255 범위의 값을 가지므로 (average / 256)을 통해 비율을 맞추며, 이 값이 클수록 막대의 높이도 커지게 된다.
          const normalizedBarHeight = (groupAmplitudeAverage * canvas.height) / 256;

          const barXCoordinate = (barWidth + barSpacing) * i;
          const barYCoordinate = canvas.height - normalizedBarHeight;

          canvasCtx.fillStyle = clientBarColor;
          canvasCtx.fillRect(barXCoordinate, barYCoordinate, barWidth, normalizedBarHeight);
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(visualizeClientAudio);
    };
    visualizeClientAudio();

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [isAudioRecording, analyserNodeRef]);

  const startAudioProcessing = async () => {
    try {
      // 1. getUserMedia로 마이크 오디오 가져오기
      // getUserMedia로 마이크에 접근하여 사용자의 마이크로부터 얻은 오디오 트랙을 포함하고 있는 MediaStream을 생성한다.
      // 이 메서드는 사용자의 미디어 장치(마이크 또는 카메라)에서 데이터를 가져오는 역할을 함
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Audiocontext 생성
      // 오디오 처리를 위해 여러 노드를 연결하고 제어하는 AudioContext 생성
      // AudioContext 내에서는 각각의 AudioNode 들로 소리를 제어한다.
      const audioContext = new AudioContext();

      // 3. MediaStreamAudioSourceNode로 오디오 소스 생성
      // audioContext.createMediaStreamSource()는 mediaStream을 입력으로 받아서, 이를 AudioNode로 변환한다.
      // 이렇게 변환된 mediaStreamAudioSourceNode는 audioContext에서 처리할 수 있는 오디오 소스로 사용된다.
      const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStream);

      // 4. 오디오 분석 노드 생성
      // AudioContext의 createAnalyser를 사용하여, 주파수를 시각화 할 수 있는 AnalyserNode 생성
      // AnalyserNode는 오디오 데이터를 분석하고, 이를 시각화하거나 다른 처리에 활용할 수 있게 해주는 노드이다.
      const analyserNode = audioContext.createAnalyser();
      // fftSize: AnalyserNode에서 주파수 분석을 위해 사용할 FFT(빠른 푸리에 변환) 크기를 설정하는 속성,
      // 기본값은 2048이며, fftSize가 클수록 더 정확한 주파수 분석을 제공하지만, 성능에 영향을 미칠 수 있음
      analyserNode.fftSize = 2048;
      // 이제 MediaStreamAudioSourceNode를 AnalyserNode에 연결하여, 오디오 데이터를 분석할 수 있도록 설정한다.
      // 즉, MediaStreamAudioSourceNode는 마이크에서 받은 실시간 오디오 데이터를 가져오고,
      // AnalyserNode는 그 데이터를 실시간으로 분석하여, 주파수 정보 등을 얻을 수 있게 된다.
      mediaStreamAudioSourceNode.connect(analyserNode);

      mediaStreamRef.current = mediaStream;
      audioContextRef.current = audioContext;
      mediaStreamAudioSourceNodeRef.current = mediaStreamAudioSourceNode;
      analyserNodeRef.current = analyserNode;

      setIsAudioRecording(true);
    } catch (error) {
      console.error('마이크에 접근할 수 없습니다:', error);
    }
  };

  const stopAudioProcessing = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

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

    setIsAudioRecording(false);
  };

  const toggleVisualization = async () => {
    if (isAudioRecording) {
      stopAudioProcessing();
    } else {
      startAudioProcessing();
    }
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='flex justify-center'>
        <div className='flex flex-col items-center gap-y-5'>
          <h1 className='text-xl font-semibold'>Audio Visualizer</h1>
          <div className='aspect-square h-[300px] w-[300px] rounded-2xl border border-[#dddddd] bg-white p-3 shadow-[4px_4px_4px_2px_rgba(166,166,166,0.10)]'>
            <canvas className='h-full w-full' ref={canvasRef} />
          </div>
          <button
            className='w-full rounded bg-slate-950 p-2 font-semibold text-white hover:bg-slate-800'
            onClick={toggleVisualization}
          >
            {isAudioRecording ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Web Audio API로 시각화하기: https://developer.mozilla.org/ko/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
