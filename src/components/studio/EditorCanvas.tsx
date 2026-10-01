import React, { useRef, useEffect, useState } from 'react';
import { Camera, RotateCcw, AlertCircle, ArrowLeftRight, Check } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { composePhotostrip } from '../../utils/canvasComposer';
import { LAYOUT_CONFIGS, getFittingLayout } from '../../utils/constants';

interface EditorCanvasProps {
  isDrawerOpen?: boolean;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ isDrawerOpen = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    capturedPhotos,
    layout,
    setLayout,
    selectedFrame,
    selectedFilter,
    studioSettings,
    setCurrentStep,
    swapPhotos,
  } = useBoothStore();

  const [selectedSwapIndex, setSelectedSwapIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const layoutConfig = LAYOUT_CONFIGS[layout];
  const requiredCount = layoutConfig.photoCount;
  const missingCount = requiredCount - capturedPhotos.length;
  const isIncomplete = missingCount > 0;
  const fittingLayout = getFittingLayout(capturedPhotos.length);

  const handleSlotClick = (index: number) => {
    if (selectedSwapIndex === null) {
      setSelectedSwapIndex(index);
    } else if (selectedSwapIndex === index) {
      setSelectedSwapIndex(null);
    } else {
      swapPhotos(selectedSwapIndex, index);
      setSelectedSwapIndex(null);
    }
  };

  // Re-compose photostrip onto canvas whenever settings or photos update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isMounted = true;

    const render = async () => {
      // High-DPI scale (2x or 3x devicePixelRatio) ensures ultra-crisp display across Retina iPhones, iPads, and desktop displays
      const dpr = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 2) : 2;
      const previewScale = Math.min(dpr, 2.5);

      await composePhotostrip(canvas, {
        photos: capturedPhotos,
        layout,
        frameId: selectedFrame,
        filter: selectedFilter,
        settings: studioSettings,
        scale: previewScale,
      });
      if (!isMounted) return;
    };

    render();

    return () => {
      isMounted = false;
    };
  }, [capturedPhotos, layout, selectedFrame, selectedFilter, studioSettings]);

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center p-1 sm:p-3 select-none relative overflow-y-auto lg:overflow-hidden no-scrollbar">
      {/* Background Studio Light Accent */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-studio-blush/40 blur-3xl" />
      </div>

      {/* Floating Missing Photos Notification Banner */}
      {isIncomplete && (
        <div className="w-full max-w-xl mb-2 z-30 bg-amber-50/95 backdrop-blur-md border border-amber-300/80 rounded-2xl p-2.5 sm:px-4 sm:py-2 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-2 animate-in fade-in duration-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-950">
                  Foto Belum Lengkap ({capturedPhotos.length}/{requiredCount})
                </span>
                <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
                  Kurang {missingCount}
                </span>
              </div>
              <p className="text-[10.5px] text-amber-900/80 leading-tight">
                Layout <strong>{layoutConfig.name}</strong> butuh {requiredCount} foto.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Option 1: Back to Live Capture */}
            <button
              type="button"
              onClick={() => setCurrentStep('booth')}
              className="px-2.5 py-1 rounded-xl bg-studio-charcoal text-white hover:bg-black text-[11px] font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Camera className="w-3 h-3 text-amber-300" />
              <span>Ambil {missingCount} Lagi</span>
            </button>

            {/* Option 2: Switch to fitting layout */}
            {fittingLayout && fittingLayout !== layout && (
              <button
                type="button"
                onClick={() => setLayout(fittingLayout)}
                className="px-2.5 py-1 rounded-xl bg-white border border-amber-300/90 text-amber-900 hover:bg-amber-100/70 text-[11px] font-semibold flex items-center gap-1 shadow-soft-sm active:scale-95 transition-all"
              >
                <RotateCcw className="w-3 h-3 text-amber-700" />
                <span>Gunakan {LAYOUT_CONFIGS[fittingLayout].name}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Interactive Photo Reorder Bar (Positioned cleanly ABOVE the photostrip frame) */}
      {capturedPhotos.length > 1 && (
        <div className="z-20 bg-white/95 backdrop-blur-md border border-black/[0.08] rounded-2xl px-2.5 py-1 sm:px-3.5 sm:py-1.5 shadow-soft-sm flex items-center gap-1.5 sm:gap-2.5 mb-1 sm:mb-2 shrink-0 max-w-[95%]">
          <div className="flex items-center gap-1 sm:gap-1.5 text-studio-graphite shrink-0">
            <ArrowLeftRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-500" />
            <span className="text-[10px] sm:text-[11px] font-bold text-studio-graphite whitespace-nowrap">
              Tukar Posisi:
            </span>
          </div>

          {/* Horizontal Thumbnail Slots */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {Array.from({ length: requiredCount }).map((_, slotIdx) => {
              const photo = capturedPhotos.find((p) => p.poseIndex === slotIdx);
              const isSelected = selectedSwapIndex === slotIdx;

              return (
                <div
                  key={slotIdx}
                  draggable={Boolean(photo)}
                  onDragStart={() => setDraggedIndex(slotIdx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIndex !== null && draggedIndex !== slotIdx) {
                      swapPhotos(draggedIndex, slotIdx);
                      setDraggedIndex(null);
                    }
                  }}
                  onClick={() => handleSlotClick(slotIdx)}
                  className={`relative rounded-lg sm:rounded-xl overflow-hidden border transition-all cursor-pointer select-none flex items-center justify-center shrink-0 w-7 h-7 sm:w-10 sm:h-10 ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50 shadow-md scale-105'
                      : photo
                      ? 'border-stone-200/90 bg-stone-900 hover:border-studio-graphite hover:scale-105'
                      : 'border-dashed border-stone-300 bg-stone-100/60 opacity-60'
                  }`}
                  title={
                    photo
                      ? `Slot 0${slotIdx + 1} - Klik atau seret untuk menukar posisi`
                      : `Slot 0${slotIdx + 1} Kosong`
                  }
                >
                  {photo ? (
                    <>
                      <img
                        src={photo.dataUrl}
                        alt={`Cut ${slotIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 px-0.5 rounded bg-black/70 text-[7px] sm:text-[8px] font-mono font-bold text-white">
                        0{slotIdx + 1}
                      </span>
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-600/35 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-[8.5px] sm:text-[9.5px] font-mono text-stone-400 font-bold">
                      0{slotIdx + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {selectedSwapIndex !== null && (
            <button
              type="button"
              onClick={() => setSelectedSwapIndex(null)}
              className="text-[9px] sm:text-[10px] text-blue-700 hover:text-blue-900 font-bold underline shrink-0 ml-1"
            >
              Batal
            </button>
          )}
        </div>
      )}

      {/* Photostrip Canvas Frame Wrapper (Realistic physical print feel) */}
      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center transition-all duration-300">
        {/* Soft studio ambient drop shadow */}
        <div className="relative rounded-xl sm:rounded-2xl shadow-photo border border-black/[0.08] bg-white flex items-center justify-center p-0.5">
          <canvas
            ref={canvasRef}
            className={`block w-auto object-contain transition-all duration-300 max-w-[85vw] sm:max-w-[340px] lg:max-w-[420px] ${
              isDrawerOpen
                ? 'max-h-[35dvh] sm:max-h-[46dvh] lg:max-h-[66vh]'
                : 'max-h-[56dvh] sm:max-h-[62dvh] lg:max-h-[66vh]'
            }`}
            style={{ imageRendering: 'auto' }}
          />

          {/* Glossy Paper Sheen Overlay (Korean Photostrip paper finish) */}
          <div className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12]" />
        </div>
      </div>
    </div>
  );
};
