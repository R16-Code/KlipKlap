import React, { useState, useCallback } from 'react';
import { Timer, Camera, Sparkles, CheckCircle, ArrowRight, RotateCcw, Check, Trash2 } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { LAYOUT_CONFIGS } from '../../utils/constants';
import { studioAudio } from '../../utils/audio';
import type { LayoutType } from '../../types';

interface MobileBoothDockProps {
  onCaptureFrame: () => string | null;
}

export const MobileBoothDock: React.FC<MobileBoothDockProps> = ({ onCaptureFrame }) => {
  const {
    layout,
    setLayout,
    timerDuration,
    setTimerDuration,
    setCaptureState,
    setCountdownValue,
    currentPoseIndex,
    setCurrentPoseIndex,
    isCapturing,
    setIsCapturing,
    capturedPhotos,
    addPhoto,
    setCurrentStep,
    swapPhotos,
    retakeSinglePhoto,
    clearPhotos,
  } = useBoothStore();

  const [selectedSwapIndex, setSelectedSwapIndex] = useState<number | null>(null);

  const layoutKeys: LayoutType[] = [
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

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const startCaptureSequence = useCallback(async () => {
    if (isCapturing) return;

    setIsCapturing(true);

    let startIdx = 0;
    if (capturedPhotos.length > 0 && capturedPhotos.length < totalPhotosNeeded) {
      startIdx = capturedPhotos.length;
    }

    for (let pose = startIdx; pose < totalPhotosNeeded; pose++) {
      setCurrentPoseIndex(pose);

      setCaptureState('countdown');
      for (let sec = timerDuration; sec > 0; sec--) {
        setCountdownValue(sec);
        studioAudio.playCountdownTick(false);
        await sleep(1000);
      }

      studioAudio.playCountdownTick(true);
      studioAudio.playShutterSound();
      setCaptureState('flash');

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

      if (pose < totalPhotosNeeded - 1) {
        setCaptureState('next_pose');
        await sleep(900);
      }
    }

    setCaptureState('completed');
    setIsCapturing(false);
    studioAudio.playSuccessChime();

    await sleep(800);
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

  const handleSlotClick = (index: number) => {
    if (isCapturing) return;

    if (selectedSwapIndex === null) {
      setSelectedSwapIndex(index);
    } else if (selectedSwapIndex === index) {
      setSelectedSwapIndex(null);
    } else {
      swapPhotos(selectedSwapIndex, index);
      setSelectedSwapIndex(null);
    }
  };

  return (
    <div className="w-full bg-studio-milk/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 border border-black/[0.08] shadow-soft-lg flex flex-col justify-between gap-2 overscroll-contain select-none">
      {/* Row 1: Layout Selection Bar & Timer Controls */}
      <div className="flex flex-col gap-1.5 shrink-0">
        {/* Top Info Header: Layout Name & Timer Duration */}
        <div className="flex items-center justify-between gap-2 px-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider shrink-0">
              Layout:
            </span>
            <span className="text-xs font-bold text-studio-graphite truncate font-sans">
              {layoutConfig.name}
            </span>
            <span className="text-[10px] text-stone-500 font-medium shrink-0">
              ({layoutConfig.photoCount} cuts)
            </span>
          </div>

          {/* Timer Presets (3s / 5s / 10s) */}
          <div className="flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-xl border border-black/[0.04] shrink-0">
            <Timer className="w-3.5 h-3.5 text-stone-500 ml-1 hidden xs:inline" />
            {[3, 5, 10].map((sec) => (
              <button
                key={sec}
                type="button"
                disabled={isCapturing}
                onClick={() => setTimerDuration(sec)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 min-h-[30px] sm:min-h-[32px] text-xs font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center ${
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

        {/* All 7 Layouts Grid (Fully visible at once, zero scroll required) */}
        <div className="grid grid-cols-7 gap-1 w-full">
          {layoutKeys.map((key) => {
            const cfg = LAYOUT_CONFIGS[key];
            const isSelected = layout === key;

            const shortLabel =
              key === 'strip_1x4'
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
                : '1×1';

            return (
              <button
                key={key}
                type="button"
                disabled={isCapturing}
                onClick={() => setLayout(key)}
                className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl border transition-all active:scale-95 text-center min-h-[40px] ${
                  isSelected
                    ? 'border-studio-graphite bg-white text-studio-graphite shadow-soft-sm ring-1 ring-studio-graphite/20 font-bold'
                    : 'border-stone-200/80 bg-stone-50/80 text-stone-600 hover:bg-white hover:text-studio-graphite font-medium'
                }`}
                title={`${cfg.name} (${cfg.photoCount} cuts)`}
              >
                <span className="text-[11px] sm:text-xs font-bold leading-none tracking-tight">
                  {shortLabel}
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] opacity-60 leading-none mt-1 font-medium">
                  ({cfg.photoCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Horizontal Thumbnail Strip Roll */}
      <div className="space-y-1 shrink-0">
        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 px-0.5">
          <span className="flex items-center gap-1.5">
            <span>Strip Roll ({capturedPhotos.length}/{totalPhotosNeeded})</span>
            {selectedSwapIndex !== null && (
              <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-bold animate-pulse">
                Pilih target tukar 0{selectedSwapIndex + 1}
              </span>
            )}
          </span>

          {capturedPhotos.length > 0 && !isCapturing && (
            <button
              type="button"
              onClick={clearPhotos}
              className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 p-1 rounded hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {Array.from({ length: totalPhotosNeeded }).map((_, index) => {
            const photo = capturedPhotos.find((p) => p.poseIndex === index);
            const isSelected = selectedSwapIndex === index;

            return (
              <div
                key={index}
                onClick={() => handleSlotClick(index)}
                className={`relative rounded-xl overflow-hidden border transition-all shrink-0 w-14 h-11 sm:w-16 sm:h-12 flex items-center justify-center cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50 shadow-md'
                    : photo
                    ? 'border-stone-200/90 bg-stone-900 shadow-soft-sm'
                    : 'border-dashed border-stone-300 bg-stone-50/80'
                }`}
                title={photo ? `Foto CUT 0${index + 1}` : `Slot CUT 0${index + 1} Kosong`}
              >
                {photo ? (
                  <>
                    <img
                      src={photo.dataUrl}
                      alt={`Cut ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0.5 left-0.5 px-1 rounded bg-black/60 backdrop-blur-sm text-[8px] font-mono font-medium text-white/90">
                      0{index + 1}
                    </span>

                    {/* Quick retake button on touch */}
                    {!isCapturing && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          retakeSinglePhoto(index);
                        }}
                        className="absolute top-0.5 right-0.5 p-1 rounded-md bg-white/90 text-stone-700 shadow-soft active:scale-90"
                        title="Foto ulang"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                      </button>
                    )}

                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-[10px] font-mono text-stone-400 font-semibold">
                    0{index + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 3: Tactile Shutter Button & Pose Chip */}
      <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 shrink-0">
        {/* Pose Indicator Chip */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-studio-graphite tracking-tight font-sans">
            {isCapturing
              ? `Shot ${currentPoseIndex + 1} of ${totalPhotosNeeded}`
              : isSequenceFinished
              ? 'Ready for Studio!'
              : `Pose ${capturedPhotos.length + 1} of ${totalPhotosNeeded}`}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPhotosNeeded }).map((_, idx) => {
              const isFilled = idx < capturedPhotos.length;
              const isCurrent = isCapturing && idx === currentPoseIndex;
              return (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-5 bg-amber-500 animate-pulse'
                      : isFilled
                      ? 'w-3.5 bg-studio-charcoal'
                      : 'w-1.5 bg-stone-300'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Shutter Button / Proceed Action */}
        <div>
          {isSequenceFinished ? (
            <button
              type="button"
              onClick={() => setCurrentStep('studio')}
              className="px-4 py-2.5 min-h-[46px] rounded-2xl bg-studio-charcoal text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 hover:bg-black transition-all shadow-md active:scale-95"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Studio Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isCapturing}
              onClick={startCaptureSequence}
              className={`relative flex items-center justify-center rounded-full p-1 transition-all active:scale-95 ${
                isCapturing ? 'opacity-80 cursor-wait' : 'cursor-pointer'
              }`}
              title="Tekan untuk mengambil foto"
              aria-label="Capture photo"
            >
              {/* Outer tactile ring */}
              <div className="w-14 h-14 rounded-full border-2 border-stone-300 flex items-center justify-center bg-stone-100/70 shadow-soft-sm">
                {/* Inner shutter core */}
                <div
                  className={`w-11 h-11 rounded-full transition-all flex items-center justify-center shadow-md ${
                    isCapturing
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-studio-charcoal text-white active:bg-black'
                  }`}
                >
                  {isCapturing ? (
                    <Sparkles className="w-5 h-5 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
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
