import { useState, useEffect, useRef, useCallback } from 'react';

function getBestVideoMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  const types = [
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return '';
}

interface UseWebcamReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  startCamera: (targetFacingMode?: 'user' | 'environment') => Promise<void>;
  stopCamera: () => void;
  syncVideoRef: (video: HTMLVideoElement | null) => void;
  captureFrame: (isMirrored: boolean, targetRatio?: number) => string | null;
  startVideoRecording: () => void;
  stopVideoRecording: () => Promise<string | null>;
  isSimulated: boolean;
  toggleSimulationMode: () => void;
  facingMode: 'user' | 'environment';
  toggleFacingMode: () => void;
  hasMultipleCameras: boolean;
}

export function useWebcam(): UseWebcamReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(true);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const facingModeRef = useRef<'user' | 'environment'>('user');
  facingModeRef.current = facingMode;

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  // Check available camera devices & touch capability
  useEffect(() => {
    async function checkDevices() {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((d) => d.kind === 'videoinput');
          const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
          setHasMultipleCameras(videoInputs.length > 1 || isTouch);
        } catch {
          const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
          setHasMultipleCameras(isTouch);
        }
      } else {
        const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        setHasMultipleCameras(isTouch);
      }
    }
    checkDevices();
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async (targetFacingMode?: 'user' | 'environment') => {
    const mode = targetFacingMode || facingModeRef.current;
    setIsLoading(true);
    setError(null);

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }

      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: { ideal: mode },
          },
          audio: false,
        });
      } catch {
        try {
          // Fallback to flexible resolution with facingMode
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: mode },
            },
            audio: false,
          });
        } catch {
          // Fallback to basic video constraint if ideal constraints fail
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      // If component unmounted while awaiting getUserMedia (React Strict Mode safeguard)
      if (!isMountedRef.current) {
        mediaStream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setHasPermission(true);
      setIsSimulated(false);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }
      setIsLoading(false);
    } catch (err: unknown) {
      console.warn('Webcam access error, offering fallback simulation:', err);
      let message = 'Unable to access camera';
      if (err instanceof Error) {
        if (err.name === 'NotReadableError' || err.message.toLowerCase().includes('in use')) {
          message = 'Device in use. Kamera laptop sedang digunakan oleh aplikasi lain (seperti Zoom, OBS, Teams, Windows Camera, atau tab browser lain).';
        } else if (err.name === 'NotAllowedError') {
          message = 'Permission denied. Izin akses kamera belum diberikan di browser.';
        } else {
          message = err.message;
        }
      }
      setError(message);
      setIsLoading(false);
      setHasPermission(false);
    }
  }, []);

  const toggleFacingMode = useCallback(() => {
    setFacingMode((prev) => {
      const next = prev === 'user' ? 'environment' : 'user';
      facingModeRef.current = next;
      startCamera(next);
      return next;
    });
  }, [startCamera]);

  // Initial camera startup with React Strict Mode safeguard
  useEffect(() => {
    isMountedRef.current = true;
    startCamera();

    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Sync stream to video element whenever ref attaches
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  // Fallback simulated camera canvas animation if no webcam hardware is available
  useEffect(() => {
    if (!isSimulated || !videoRef.current) return;

    // Create a mock canvas stream
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    let animationId: number;
    let t = 0;

    const renderSimulation = () => {
      t += 0.03;
      if (ctx) {
        // Gradient warm studio background
        const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bgGrad.addColorStop(0, '#FAF7F2');
        bgGrad.addColorStop(1, '#ECE6DC');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Soft studio ambient spotlight
        const lightGrad = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2 - 20, 50,
          canvas.width / 2, canvas.height / 2, 450
        );
        lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        lightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Simulated friendly portrait silhouette
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2 + Math.sin(t) * 8);

        // Body / shoulders
        ctx.fillStyle = '#C2B8A8';
        ctx.beginPath();
        ctx.ellipse(0, 220, 180, 120, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#E5D6C7';
        ctx.beginPath();
        ctx.ellipse(0, 40, 95, 120, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#4A4138';
        ctx.beginPath();
        ctx.ellipse(0, 0, 105, 90, 0, 0, Math.PI);
        ctx.fill();

        // Cheeks blush
        ctx.fillStyle = 'rgba(240, 160, 150, 0.4)';
        ctx.beginPath();
        ctx.arc(-45, 55, 18, 0, Math.PI * 2);
        ctx.arc(45, 55, 18, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (happy curve)
        ctx.strokeStyle = '#4A4138';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(-40, 35, 14, Math.PI * 0.1, Math.PI * 0.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(40, 35, 14, Math.PI * 0.1, Math.PI * 0.9);
        ctx.stroke();

        // Smile
        ctx.beginPath();
        ctx.arc(0, 65, 22, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();

        ctx.restore();

        // Studio indicator text
        ctx.fillStyle = '#8C8275';
        ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('KLIPKLAP STUDIO CAMERA FEED (DEMO MODE)', canvas.width / 2, 70);
      }
      animationId = requestAnimationFrame(renderSimulation);
    };

    renderSimulation();

    const mockStream = canvas.captureStream(30);
    streamRef.current = mockStream;
    setStream(mockStream);

    if (videoRef.current) {
      videoRef.current.srcObject = mockStream;
      videoRef.current.play().catch(() => {});
    }

    return () => {
      cancelAnimationFrame(animationId);
      mockStream.getTracks().forEach((track) => track.stop());
      if (streamRef.current === mockStream) {
        streamRef.current = null;
      }
    };
  }, [isSimulated]);

  /**
   * Immediately re-binds active media stream to newly mounted video DOM element.
   * Prevents black screen when navigating between Booth and Studio!
   */
  const syncVideoRef = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video) return;
      videoRef.current = video;

      const activeStream = streamRef.current;
      if (activeStream && activeStream.active) {
        if (video.srcObject !== activeStream) {
          video.srcObject = activeStream;
        }
        video.play().catch(() => {});
      } else if (!isSimulated) {
        startCamera();
      }
    },
    [isSimulated, startCamera]
  );

  const toggleSimulationMode = useCallback(() => {
    setIsSimulated((prev) => {
      const next = !prev;
      if (next) {
        setError(null);
        setIsLoading(false);
        setHasPermission(true);
      } else {
        startCamera();
      }
      return next;
    });
  }, [startCamera]);

  /**
   * Captures a single frame from the live video feed with center-crop cover geometry.
   * Prevents stretching and respects mirror settings.
   */
  const captureFrame = useCallback(
    (isMirrored: boolean, targetRatio = 4 / 3): string | null => {
      const video = videoRef.current;
      if (!video) return null;

      const videoWidth = video.videoWidth || 1280;
      const videoHeight = video.videoHeight || 960;

      if (videoWidth === 0 || videoHeight === 0) return null;

      // Desired output dimensions (high resolution for 300 DPI target print clarity)
      const outputWidth = 1440;
      const outputHeight = Math.round(outputWidth / targetRatio);

      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Calculate center-crop geometry (object-fit: cover)
      const videoRatio = videoWidth / videoHeight;
      let sx = 0;
      let sy = 0;
      let sWidth = videoWidth;
      let sHeight = videoHeight;

      if (videoRatio > targetRatio) {
        // Video is wider than target ratio: crop left and right
        sWidth = videoHeight * targetRatio;
        sx = (videoWidth - sWidth) / 2;
      } else {
        // Video is taller than target ratio: crop top and bottom
        sHeight = videoWidth / targetRatio;
        sy = (videoHeight - sHeight) / 2;
      }

      ctx.save();

      // Handle horizontal mirroring: ONLY if user camera (front/selfie)
      const shouldMirror = isMirrored && facingModeRef.current === 'user';
      if (shouldMirror) {
        ctx.translate(outputWidth, 0);
        ctx.scale(-1, 1);
      }

      // Draw cropped source video into output canvas
      ctx.drawImage(
        video,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        outputWidth,
        outputHeight
      );

      ctx.restore();

      return canvas.toDataURL('image/jpeg', 0.95);
    },
    []
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  /**
   * Starts recording the video stream for the upcoming pose.
   * Works seamlessly with both real webcam stream and simulated canvas stream.
   */
  const startVideoRecording = useCallback(() => {
    const activeStream = streamRef.current;
    if (!activeStream || !activeStream.active) return;

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }

      recordedChunksRef.current = [];
      const mimeType = getBestVideoMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(activeStream, options);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
    } catch (err) {
      console.warn('Could not start MediaRecorder for pose:', err);
    }
  }, []);

  /**
   * Stops recording the video stream for the pose and returns a Blob URL.
   */
  const stopVideoRecording = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        try {
          const mimeType = recorder.mimeType || 'video/mp4';
          const blob = new Blob(recordedChunksRef.current, { type: mimeType });
          if (blob.size > 0) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            resolve(null);
          }
        } catch (e) {
          console.warn('Error creating video blob URL:', e);
          resolve(null);
        } finally {
          mediaRecorderRef.current = null;
          recordedChunksRef.current = [];
        }
      };

      try {
        recorder.stop();
      } catch (err) {
        console.warn('Error stopping MediaRecorder:', err);
        resolve(null);
      }
    });
  }, []);

  return {
    videoRef,
    stream,
    isLoading,
    error,
    hasPermission,
    startCamera,
    stopCamera,
    syncVideoRef,
    captureFrame,
    startVideoRecording,
    stopVideoRecording,
    isSimulated,
    toggleSimulationMode,
    facingMode,
    toggleFacingMode,
    hasMultipleCameras,
  };
}
