import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebcamReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureFrame: (isMirrored: boolean, targetRatio?: number) => string | null;
  isSimulated: boolean;
  toggleSimulationMode: () => void;
}

export function useWebcam(): UseWebcamReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      setStream(mediaStream);
      setHasPermission(true);
      setIsSimulated(false);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {
          // Autoplay was prevented or interrupted
        });
      }
      setIsLoading(false);
    } catch (err: unknown) {
      console.warn('Webcam access error, offering fallback simulation:', err);
      const message = err instanceof Error ? err.message : 'Unable to access camera';
      setError(message);
      setIsLoading(false);
      setHasPermission(false);
    }
  }, [stream]);

  // Initial camera startup
  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (videoRef.current) {
      videoRef.current.srcObject = mockStream;
      videoRef.current.play().catch(() => {});
    }

    return () => {
      cancelAnimationFrame(animationId);
      mockStream.getTracks().forEach((track) => track.stop());
    };
  }, [isSimulated]);

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

      // Handle horizontal mirroring if enabled
      if (isMirrored) {
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

  return {
    videoRef,
    stream,
    isLoading,
    error,
    hasPermission,
    startCamera,
    stopCamera,
    captureFrame,
    isSimulated,
    toggleSimulationMode,
  };
}
