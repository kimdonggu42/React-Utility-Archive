import { useState, useEffect, useRef } from 'react';

interface Constraints {
  audio: boolean;
  video: boolean;
}

const constraints: Constraints = { audio: true, video: true };

export default function WebRTCPage() {
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        mediaStreamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;

          const videoTracks = mediaStream.getVideoTracks();
          videoTracks.forEach((track) => (track.enabled = false));

          const audioTracks = mediaStream.getAudioTracks();
          audioTracks.forEach((track) => (track.enabled = false));
        }
      } catch (err) {
        console.error(err);
      }
    };
    getUserMedia();
  }, []);

  const handleCameraClick = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => (track.enabled = !track.enabled));
      setIsCameraEnabled((prev) => !prev);
    }
  };

  const handleMuteClick = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !track.enabled));
      setIsAudioMuted((prev) => !prev);
    }
  };

  return (
    <div>
      <video playsInline autoPlay width='400' height='400' ref={videoRef} />
      <button onClick={handleCameraClick}>{isCameraEnabled ? 'Camera Off' : 'Camera On'}</button>
      <button onClick={handleMuteClick}>{isAudioMuted ? 'Unmute' : 'Mute'}</button>
    </div>
  );
}
