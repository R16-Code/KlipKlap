import React, { useRef, useEffect } from 'react';
import { Camera, RotateCcw, AlertCircle } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { composePhotostrip } from '../../utils/canvasComposer';
import { LAYOUT_CONFIGS, getFittingLayout } from '../../utils/constants';

export const EditorCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    capturedPhotos,
    layout,
    setLayout,
    selectedFrame,
    selectedFilter,
    studioSettings,
    setCurrentStep,
  } = useBoothStore();

  const layoutConfig = LAYOUT_CONFIGS[layout];
  const requiredCount = layoutConfig.photoCount;
  const missingCount = requiredCount - capturedPhotos.length;
  const isIncomplete = missingCount > 0;
  const fittingLayout = getFittingLayout(capturedPhotos.length);

  // Re-compose photostrip onto canvas whenever settings or photos update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isMounted = true;

    const render = async () => {
      // Scale 1.5 gives crisp retina display rendering inside the UI container
      await composePhotostrip(canvas, {
        photos: capturedPhotos,
        layout,
        frameId: selectedFrame,
        filter: selectedFilter,
        settings: studioSettings,
        scale: 1.5,
      });
      if (!isMounted) return;
    };

    render();

    return () => {
      isMounted = false;
    };
  }, [capturedPhotos, layout, selectedFrame, selectedFilter, studioSettings]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Background Studio Light Accent */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-studio-blush/40 blur-3xl" />
      </div>

      {/* Floating Missing Photos Notification Banner */}
      {isIncomplete && (
        <div className="absolute top-3 left-4 right-4 z-20 bg-amber-50/95 backdrop-blur-md border border-amber-300/80 rounded-2xl p-2.5 sm:px-4 sm:py-2.5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-2.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-950">
                  Slot Foto Belum Lengkap ({capturedPhotos.length} dari {requiredCount} Foto)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-200 text-amber-900">
                  Kurang {missingCount} Foto
                </span>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-tight">
                Ada {missingCount} slot kosong pada layout <strong>{layoutConfig.name}</strong>. Anda dapat mengambil foto lagi atau menyesuaikan layout.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Option 1: Back to Live Capture */}
            <button
              type="button"
              onClick={() => setCurrentStep('booth')}
              className="px-3 py-1.5 rounded-xl bg-studio-charcoal text-white hover:bg-black text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>Ambil {missingCount} Foto Lagi</span>
            </button>

            {/* Option 2: Switch to fitting layout */}
            {fittingLayout && fittingLayout !== layout && (
              <button
                type="button"
                onClick={() => setLayout(fittingLayout)}
                className="px-3 py-1.5 rounded-xl bg-white border border-amber-300/90 text-amber-900 hover:bg-amber-100/70 text-xs font-semibold flex items-center gap-1.5 shadow-soft-sm active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Gunakan Layout {LAYOUT_CONFIGS[fittingLayout].name}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Photostrip Canvas Frame Wrapper (Realistic physical print feel) */}
      <div className="relative z-10 max-h-[92%] flex items-center justify-center transition-all duration-300 transform hover:scale-[1.005]">
        {/* Soft studio ambient drop shadow */}
        <div className="relative rounded-2xl shadow-photo overflow-hidden border border-black/[0.08] bg-white">
          <canvas
            ref={canvasRef}
            className="block max-h-[74vh] w-auto max-w-[85vw] object-contain transition-all"
            style={{ imageRendering: 'auto' }}
          />

          {/* Glossy Paper Sheen Overlay (Korean Photostrip paper finish) */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12]" />
        </div>
      </div>
    </div>
  );
};
