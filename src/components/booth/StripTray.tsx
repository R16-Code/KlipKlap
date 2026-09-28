import React from 'react';
import { RotateCcw, ArrowRight, Camera, Sparkles, Trash2 } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { LAYOUT_CONFIGS } from '../../utils/constants';

export const StripTray: React.FC = () => {
  const {
    layout,
    capturedPhotos,
    retakeSinglePhoto,
    clearPhotos,
    setCurrentStep,
    isCapturing,
  } = useBoothStore();

  const layoutConfig = LAYOUT_CONFIGS[layout];
  const totalSlots = layoutConfig.photoCount;
  const isComplete = capturedPhotos.length >= totalSlots;

  return (
    <aside aria-label="Photo Strip Roll" className="w-full h-full flex flex-col bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-black/[0.06] shadow-soft overflow-hidden">
      {/* Tray Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/60">
        <div>
          <h2 className="text-xs font-bold tracking-wider text-studio-graphite uppercase font-sans">
            Strip Roll
          </h2>
          <p className="text-[11px] text-stone-600 font-medium">
            {capturedPhotos.length} of {totalSlots} shots taken
          </p>
        </div>

        {capturedPhotos.length > 0 && !isCapturing && (
          <button
            type="button"
            onClick={clearPhotos}
            className="flex items-center gap-1 text-[11px] font-medium text-stone-600 hover:text-red-700 transition-colors p-1"
            title="Clear all photos"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Thumbnails Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-2.5">
        {Array.from({ length: totalSlots }).map((_, index) => {
          const photo = capturedPhotos.find((p) => p.poseIndex === index);

          return (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden border transition-all ${
                photo
                  ? 'border-stone-200/80 shadow-soft-sm bg-stone-900 group aspect-[4/3]'
                  : 'border-dashed border-stone-300 bg-stone-50/60 aspect-[4/3] flex flex-col items-center justify-center text-stone-400'
              }`}
            >
              {photo ? (
                <>
                  <img
                    src={photo.dataUrl}
                    alt={`Pose Cut ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Slot Number Label */}
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono font-medium text-white/90">
                    0{index + 1}
                  </span>

                  {/* Hover Overlay: Retake Button */}
                  {!isCapturing && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => retakeSinglePhoto(index)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/95 text-studio-graphite text-xs font-semibold flex items-center gap-1.5 hover:bg-white shadow-soft transition-transform active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-stone-200/50 flex items-center justify-center text-stone-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-stone-400 tracking-wider">
                    CUT 0{index + 1}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-stone-200/60 mt-auto">
        <button
          type="button"
          disabled={!isComplete || isCapturing}
          onClick={() => setCurrentStep('studio')}
          className={`w-full py-3 px-4 rounded-2xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
            isComplete && !isCapturing
              ? 'bg-studio-charcoal text-white hover:bg-black shadow-md cursor-pointer active:scale-[0.98]'
              : 'bg-stone-200/70 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>{isComplete ? 'Edit & Customize' : `Take ${totalSlots - capturedPhotos.length} More`}</span>
          {isComplete ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </aside>
  );
};
