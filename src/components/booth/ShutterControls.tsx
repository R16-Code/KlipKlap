import React, { useEffect, useCallback } from 'react';
import { Timer, Camera, Sparkles, CheckCircle } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { LAYOUT_CONFIGS } from '../../utils/constants';
import { studioAudio } from '../../utils/audio';

interface ShutterControlsProps {
  onCaptureFrame: () => string | null;
}

export const ShutterControls: React.FC<ShutterControlsProps> = ({ onCaptureFrame }) => {
  const {
    layout,
    setLayout,
    timerDuration,
    setTimerDuration,
    captureState,
    setCaptureState,
    setCountdownValue,
    currentPoseIndex,
    setCurrentPoseIndex,
    isCapturing,
    setIsCapturing,
    capturedPhotos,
    addPhoto,
    setCurrentStep,
  } = useBoothStore();

  const layoutKeys: import('../../types').LayoutType[] = [
    'strip_1x4',
    'strip_1x3',
    'grid_2x2',
    'grid_3x3',
    'grid_2x3',
    'strip_1x2',
    'polaroid_1x1',
  ];

  const layoutConfig = LAYOUT_CONFIGS[layout];
  const totalPhotosNeeded = layoutConfig.photoCount;
  const isSequenceFinished = capturedPhotos.length >= totalPhotosNeeded;

  // Sleep utility for async sequence timing
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Orchestrates the sequential auto-capture flow:
   * 'idle' -> 'countdown' -> 'flash' -> 'captured' -> 'next_pose' -> 'completed'
   */
  const startCaptureSequence = useCallback(async () => {
    if (isCapturing) return;

    setIsCapturing(true);

    // Determine starting pose index
    let startIdx = 0;
    if (capturedPhotos.length > 0 && capturedPhotos.length < totalPhotosNeeded) {
      startIdx = capturedPhotos.length;
    }

    for (let pose = startIdx; pose < totalPhotosNeeded; pose++) {
      setCurrentPoseIndex(pose);

      // 1. Countdown phase
      setCaptureState('countdown');
      for (let sec = timerDuration; sec > 0; sec--) {
        setCountdownValue(sec);
        studioAudio.playCountdownTick(false);
        await sleep(1000);
      }

      // 2. Flash & capture phase
      studioAudio.playCountdownTick(true);
      studioAudio.playShutterSound();
      setCaptureState('flash');

      // Grab frame immediately on shutter
      const photoDataUrl = onCaptureFrame();
      if (photoDataUrl) {
        addPhoto({
          id: `photo_${Date.now()}_${pose}`,
          dataUrl: photoDataUrl,
          poseIndex: pose,
          timestamp: Date.now(),
        });
      }

      await sleep(350);
      setCaptureState('captured');

      // 3. Short inter-pose pause if more photos remain
      if (pose < totalPhotosNeeded - 1) {
        setCaptureState('next_pose');
        await sleep(900);
      }
    }

    // 4. Session completed
    setCaptureState('completed');
    setIsCapturing(false);
    studioAudio.playSuccessChime();

    // Auto transition to Studio Editor after brief celebration
    await sleep(900);
    setCurrentStep('studio');
  }, [
    isCapturing,
    capturedPhotos.length,
    totalPhotosNeeded,
    setIsCapturing,
    setCurrentPoseIndex,
    setCaptureState,
    timerDuration,
    setCountdownValue,
    onCaptureFrame,
    addPhoto,
    setCurrentStep,
  ]);

  // Keyboard shortcut: Spacebar triggers capture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isCapturing && captureState === 'idle') {
        e.preventDefault();
        startCaptureSequence();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCapturing, captureState, startCaptureSequence]);

  return (
    <div className="w-full bg-studio-milk/90 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-black/[0.05] shadow-soft-sm flex flex-col gap-2">
      {/* Upper Layout Selector & Timer Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Layout Selection Pills (7 layouts displayed under camera) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mr-0.5 shrink-0">
            Layout:
          </span>
          {layoutKeys.map((key) => {
            const cfg = LAYOUT_CONFIGS[key];
            const isSelected = layout === key;

            return (
              <button
                key={key}
                type="button"
                disabled={isCapturing}
                onClick={() => setLayout(key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'border-studio-graphite bg-white text-studio-graphite shadow-soft-sm ring-1 ring-studio-graphite/20'
                    : 'border-stone-200/80 bg-stone-50/70 text-stone-600 hover:bg-white hover:text-stone-900'
                }`}
                title={`${cfg.name} (${cfg.photoCount} cuts)`}
              >
                {/* Mini wireframe */}
                <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  {key === 'grid_3x3' ? (
                    <span className="w-3 h-3 grid grid-cols-3 gap-0.5">
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                    </span>
                  ) : key === 'grid_2x3' ? (
                    <span className="w-2.5 h-3 grid grid-cols-2 gap-0.5">
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                    </span>
                  ) : key === 'grid_2x2' ? (
                    <span className="w-3 h-3 grid grid-cols-2 gap-0.5">
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                      <span className="bg-current rounded-[0.5px]" />
                    </span>
                  ) : key === 'polaroid_1x1' ? (
                    <span className="w-3 h-3 flex flex-col p-0.5 pb-1 bg-stone-300 rounded-[1px]">
                      <span className="flex-1 bg-current rounded-[0.5px]" />
                    </span>
                  ) : (
                    <span className="w-2.5 h-3 flex flex-col gap-0.5">
                      <span className="flex-1 bg-current rounded-[0.5px]" />
                      <span className="flex-1 bg-current rounded-[0.5px]" />
                    </span>
                  )}
                </div>
                <span>
                  {key === 'strip_1x4'
                    ? '1×4'
                    : key === 'strip_1x3'
                    ? '1×3'
                    : key === 'grid_2x2'
                    ? '2×2'
                    : key === 'grid_3x3'
                    ? '3×3'
                    : key === 'grid_2x3'
                    ? '2×3'
                    : key === 'strip_1x2'
                    ? '1×2'
                    : '1×1'}
                </span>
                <span className="text-[10px] opacity-60">({cfg.photoCount})</span>
              </button>
            );
          })}
        </div>

        {/* Timer Presets (3s / 5s) */}
        <div className="flex items-center gap-1.5 bg-stone-100/90 p-1 rounded-xl border border-black/[0.04] shrink-0">
          <Timer className="w-3.5 h-3.5 text-stone-500 ml-1.5" />
          {[3, 5].map((sec) => (
            <button
              key={sec}
              type="button"
              disabled={isCapturing}
              onClick={() => setTimerDuration(sec)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                timerDuration === sec
                  ? 'bg-white text-studio-graphite shadow-soft-sm'
                  : 'text-stone-500 hover:text-studio-graphite'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Main Shutter & Pose Indicator Row */}
      <div className="flex items-center justify-between">
        {/* Pose Counter Dots */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
            {isCapturing
              ? `Capturing Pose ${currentPoseIndex + 1} of ${totalPhotosNeeded}`
              : isSequenceFinished
              ? 'All Poses Captured'
              : `Pose ${capturedPhotos.length + 1} of ${totalPhotosNeeded}`}
          </span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPhotosNeeded }).map((_, idx) => {
              const isFilled = idx < capturedPhotos.length;
              const isCurrent = isCapturing && idx === currentPoseIndex;
              return (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-6 bg-amber-500 animate-pulse'
                      : isFilled
                      ? 'w-4 bg-studio-charcoal'
                      : 'w-2 bg-stone-300'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Shutter Button (Korean Photobooth Signature Circular Button) */}
        <div className="flex items-center gap-3">
          {isSequenceFinished ? (
            <button
              type="button"
              onClick={() => setCurrentStep('studio')}
              className="px-5 py-2.5 rounded-2xl bg-studio-charcoal text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-2 hover:bg-black transition-all shadow-md active:scale-95"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Proceed to Studio</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isCapturing}
              onClick={startCaptureSequence}
              className={`relative group flex items-center justify-center rounded-full p-1 transition-all ${
                isCapturing
                  ? 'opacity-80 cursor-wait'
                  : 'hover:scale-105 active:scale-95 cursor-pointer'
              }`}
              title="Click or press Spacebar to capture"
            >
              {/* Outer tactile ring */}
              <div className="w-13 h-13 rounded-full border-2 border-stone-300 group-hover:border-studio-graphite transition-colors flex items-center justify-center bg-stone-100/50 shadow-soft-sm">
                {/* Inner shutter core button */}
                <div
                  className={`w-10 h-10 rounded-full transition-all flex items-center justify-center shadow-md ${
                    isCapturing
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-studio-charcoal text-white group-hover:bg-black'
                  }`}
                >
                  {isCapturing ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
