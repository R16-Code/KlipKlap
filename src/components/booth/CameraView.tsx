import React, { useEffect } from 'react';
import { FlipHorizontal, AlertCircle, Sparkles, RefreshCw, SwitchCamera } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  startCamera: () => void;
  isSimulated: boolean;
  toggleSimulationMode: () => void;
  syncVideoRef?: (video: HTMLVideoElement | null) => void;
  facingMode?: 'user' | 'environment';
  toggleFacingMode?: () => void;
  hasMultipleCameras?: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  isLoading,
  error,
  hasPermission,
  startCamera,
  isSimulated,
  toggleSimulationMode,
  syncVideoRef,
  facingMode = 'user',
  toggleFacingMode,
  hasMultipleCameras = false,
}) => {
  const { isMirrored, toggleMirror, captureState, countdownValue, currentPoseIndex } =
    useBoothStore();

  // Effective mirror: only apply mirror flip when using front (user) camera
  const effectiveMirror = isMirrored && facingMode === 'user';

  // Re-bind media stream to video element on component mount (e.g. Back from Studio)
  useEffect(() => {
    if (videoRef.current && syncVideoRef) {
      syncVideoRef(videoRef.current);
    }
  }, [videoRef, syncVideoRef]);

  return (
    <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-black/10 shadow-soft-lg flex items-center justify-center">
      {/* HTML5 Live Video Feed */}
      <video
        ref={(el) => {
          (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
          if (el && syncVideoRef) {
            syncVideoRef(el);
          }
        }}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-transform duration-300 ${
          effectiveMirror ? '-scale-x-100' : 'scale-x-100'
        }`}
      />

      {/* Subtle Studio Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-black/30" />

      {/* Top Controls Bar */}
      <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 flex items-center justify-between pointer-events-auto z-20">
        {/* Live Studio Status Pill */}
        <div className="flex items-center gap-2 bg-stone-900/70 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-full border border-white/10 text-white shadow-soft-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase">
            {isSimulated ? 'Simulated' : 'Live Camera'}
          </span>
          <span className="text-[9px] sm:text-[10px] text-stone-300 font-mono hidden xs:inline">1080p</span>
        </div>

        {/* Action Buttons: Flip Camera, Mirror & Demo Mode */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {error && (
            <button
              type="button"
              onClick={toggleSimulationMode}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-full bg-amber-500/90 text-white text-xs font-semibold hover:bg-amber-600 transition-colors shadow-soft-sm backdrop-blur-md active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Use Demo</span>
            </button>
          )}

          {/* Flip Camera Button (Front / Rear toggle for mobile & touch devices) */}
          {(hasMultipleCameras || toggleFacingMode) && (
            <button
              type="button"
              onClick={toggleFacingMode}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[44px] min-w-[44px] rounded-full text-xs font-semibold transition-all backdrop-blur-md bg-stone-900/70 text-white/90 border border-white/15 hover:bg-stone-900/90 active:scale-95 shadow-soft-sm"
              title="Beralih kamera depan/belakang"
              aria-label="Switch front or back camera"
            >
              <SwitchCamera className="w-4 h-4 text-white" />
              <span className="text-[11px] font-medium hidden md:inline">
                {facingMode === 'environment' ? 'Rear' : 'Front'}
              </span>
            </button>
          )}

          {/* Mirror Toggle (Available only for front/selfie camera) */}
          {facingMode !== 'environment' && (
            <button
              type="button"
              onClick={toggleMirror}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[44px] min-w-[44px] rounded-full text-xs font-semibold transition-all backdrop-blur-md border active:scale-95 ${
                effectiveMirror
                  ? 'bg-white/95 text-studio-graphite border-white shadow-soft-sm'
                  : 'bg-stone-900/70 text-white/90 border-white/15 hover:bg-stone-900/90'
              }`}
              title="Mirror camera horizontal flip"
              aria-label="Toggle mirror mode"
            >
              <FlipHorizontal className="w-4 h-4" />
              <span className="hidden md:inline">Mirror: {effectiveMirror ? 'ON' : 'OFF'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Framing Guides (Subtle Rule-of-Thirds / Center Portrait Lines) */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-30">
        <div className="w-[82%] h-[82%] border border-dashed border-white/40 rounded-2xl relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-t border-b border-white/40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-l border-r border-white/40" />
        </div>
      </div>

      {/* Shutter Flash Animation Effect */}
      {captureState === 'flash' && (
        <div className="absolute inset-0 z-40 bg-white animate-studio-flash pointer-events-none" />
      )}

      {/* Countdown Badge Overlay */}
      {captureState === 'countdown' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[2px]">
          <div className="flex flex-col items-center animate-popIn">
            <div className="w-28 h-28 rounded-full bg-white/95 text-studio-graphite flex items-center justify-center shadow-photo border-4 border-white/60">
              <span className="text-6xl font-bold font-sans tracking-tighter">
                {countdownValue}
              </span>
            </div>
            <div className="mt-4 px-4 py-1.5 rounded-full bg-stone-900/75 backdrop-blur-md text-white text-xs font-medium tracking-widest uppercase">
              Pose {currentPoseIndex + 1} • Smile! 찰칵!
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-30 bg-stone-900/85 backdrop-blur-md flex flex-col items-center justify-center text-white p-6">
          <RefreshCw className="w-8 h-8 animate-spin text-stone-300 mb-3" />
          <p className="text-sm font-medium tracking-wide">Starting Studio Camera...</p>
          <p className="text-xs text-stone-400 mt-1">Please allow camera permissions if prompted</p>
        </div>
      )}

      {/* Camera Permission / Error State */}
      {!isLoading && !hasPermission && error && (
        <div className="absolute inset-0 z-30 bg-stone-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold">Camera Access Required</h3>
          <p className="text-xs text-stone-300 mt-2 max-w-md leading-relaxed">
            {error}
          </p>
          <p className="text-[11px] text-stone-400 mt-1 max-w-sm">
            Pastikan aplikasi lain yang memakai webcam (Zoom, OBS, Teams, Windows Camera, atau tab lain) sudah ditutup, lalu klik Coba Lagi.
          </p>

          <div className="flex items-center gap-3 mt-5">
            <button
              type="button"
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-white text-studio-graphite text-xs font-semibold hover:bg-stone-100 transition-colors shadow-soft"
            >
              Coba Lagi Kamera
            </button>
            <button
              type="button"
              onClick={toggleSimulationMode}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use Simulated Feed</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
