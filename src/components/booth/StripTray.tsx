import React, { useState } from 'react';
import { RotateCcw, ArrowRight, Camera, Sparkles, Trash2, ArrowLeftRight, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { LAYOUT_CONFIGS } from '../../utils/constants';
import type { LayoutType } from '../../types';

export const StripTray: React.FC = () => {
  const {
    layout,
    setLayout,
    capturedPhotos,
    retakeSinglePhoto,
    swapPhotos,
    clearPhotos,
    setCurrentStep,
    isCapturing,
  } = useBoothStore();

  const [selectedSwapIndex, setSelectedSwapIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const layoutConfig = LAYOUT_CONFIGS[layout];
  const totalSlots = layoutConfig.photoCount;
  const isComplete = capturedPhotos.length >= totalSlots;

  const layoutKeys: LayoutType[] = [
    'strip_1x4',
    'strip_1x3',
    'grid_2x2',
    'grid_3x3',
    'grid_2x3',
    'strip_1x2',
    'polaroid_1x1',
  ];

  const handleSlotClick = (index: number) => {
    if (isCapturing) return;

    if (selectedSwapIndex === null) {
      // Select source photo to swap
      setSelectedSwapIndex(index);
    } else if (selectedSwapIndex === index) {
      // Deselect
      setSelectedSwapIndex(null);
    } else {
      // Perform swap
      swapPhotos(selectedSwapIndex, index);
      setSelectedSwapIndex(null);
    }
  };

  return (
    <aside aria-label="Photo Strip Roll and Layout Selection" className="w-full h-full flex flex-col bg-white/75 backdrop-blur-md rounded-3xl p-4 border border-black/[0.06] shadow-soft overflow-hidden">
      {/* 1. Layout Selector Section */}
      <div className="pb-3 border-b border-stone-200/60 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold tracking-wider text-studio-graphite uppercase font-sans">
              1. Pilih Layout
            </h2>
            <p className="text-[10.5px] text-stone-600 font-medium">
              {layoutConfig.name} ({totalSlots} cuts)
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200/60">
            {totalSlots} Poses
          </span>
        </div>

        {/* Layout Selection Grid (All 7 layouts displayed cleanly without horizontal scroll) */}
        <div className="grid grid-cols-4 gap-1.5 pt-0.5">
          {layoutKeys.map((key) => {
            const cfg = LAYOUT_CONFIGS[key];
            const isSelected = layout === key;

            return (
              <button
                key={key}
                type="button"
                disabled={isCapturing}
                onClick={() => {
                  setLayout(key);
                  setSelectedSwapIndex(null);
                }}
                className={`flex flex-col items-center justify-center p-1.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-studio-graphite bg-white shadow-soft-sm ring-1 ring-studio-graphite/20 text-studio-graphite'
                    : 'border-stone-200/80 bg-stone-50/60 hover:bg-white text-stone-600'
                }`}
                title={`${cfg.name} (${cfg.photoCount} cuts)`}
              >
                {/* Mini wireframe */}
                <div className="w-4 h-4 flex items-center justify-center mb-0.5">
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
                    <span className="w-2.5 h-3.5 grid grid-cols-2 gap-0.5">
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
                    <span className="w-3 h-3.5 flex flex-col p-0.5 pb-1 bg-stone-300 rounded-[1.5px]">
                      <span className="flex-1 bg-current rounded-[0.5px]" />
                    </span>
                  ) : (
                    <span className="w-2.5 h-3.5 flex flex-col gap-0.5">
                      <span className="flex-1 bg-current rounded-[0.5px]" />
                      <span className="flex-1 bg-current rounded-[0.5px]" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold leading-tight">
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
                <span className="text-[9px] opacity-70 leading-none">
                  {cfg.photoCount} cuts
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Strip Roll Header */}
      <div className="flex items-center justify-between py-2 border-b border-stone-200/40">
        <div>
          <span className="text-xs font-bold tracking-wider text-studio-graphite uppercase font-sans">
            2. Strip Roll
          </span>
          <span className="text-[10.5px] text-stone-600 font-medium ml-2">
            {capturedPhotos.length} of {totalSlots} shots taken
          </span>
        </div>

        {capturedPhotos.length > 0 && !isCapturing && (
          <button
            type="button"
            onClick={clearPhotos}
            className="flex items-center gap-1 text-[10.5px] font-medium text-stone-600 hover:text-red-700 transition-colors p-1"
            title="Clear all photos"
          >
            <Trash2 className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Swap Hint Bar */}
      {capturedPhotos.length > 1 && !isCapturing && (
        <div className="py-1 px-2 my-1 bg-stone-100/80 rounded-xl text-[10px] text-stone-600 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ArrowLeftRight className="w-3 h-3 text-stone-500" />
            <span>{selectedSwapIndex !== null ? `Klik slot tujuan untuk tukar foto 0${selectedSwapIndex + 1}` : 'Klik / seret foto untuk tukar posisi'}</span>
          </span>
          {selectedSwapIndex !== null && (
            <button
              type="button"
              onClick={() => setSelectedSwapIndex(null)}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Batal
            </button>
          )}
        </div>
      )}

      {/* 3. Thumbnails Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-2">
        {Array.from({ length: totalSlots }).map((_, index) => {
          const photo = capturedPhotos.find((p) => p.poseIndex === index);
          const isSelectedForSwap = selectedSwapIndex === index;

          return (
            <div
              key={index}
              draggable={Boolean(photo && !isCapturing)}
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedIndex !== null && draggedIndex !== index) {
                  swapPhotos(draggedIndex, index);
                  setDraggedIndex(null);
                }
              }}
              className={`relative rounded-2xl overflow-hidden border transition-all ${
                isSelectedForSwap
                  ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50 shadow-md scale-[0.98]'
                  : photo
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

                  {/* Move Up / Down Buttons on Right */}
                  {!isCapturing && (
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            swapPhotos(index, index - 1);
                          }}
                          className="w-5 h-5 rounded-md bg-black/60 hover:bg-black text-white flex items-center justify-center shadow-sm"
                          title="Pindah ke Atas"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {index < totalSlots - 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            swapPhotos(index, index + 1);
                          }}
                          className="w-5 h-5 rounded-md bg-black/60 hover:bg-black text-white flex items-center justify-center shadow-sm"
                          title="Pindah ke Bawah"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Hover Overlay: Swap & Retake Action */}
                  {!isCapturing && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSlotClick(index)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/95 text-studio-graphite text-xs font-semibold flex items-center gap-1 hover:bg-white shadow-soft transition-transform active:scale-95"
                        title="Tukar posisi foto ini dengan foto lain"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        <span>Tukar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => retakeSinglePhoto(index)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/95 text-studio-graphite text-xs font-semibold flex items-center gap-1 hover:bg-white shadow-soft transition-transform active:scale-95"
                        title="Foto ulang pose ini"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake</span>
                      </button>
                    </div>
                  )}

                  {/* Selected Swap Highlight */}
                  {isSelectedForSwap && (
                    <div className="absolute inset-0 bg-blue-600/25 flex items-center justify-center">
                      <div className="px-2 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-md">
                        <Check className="w-3.5 h-3.5" />
                        <span>Pilih foto lain</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div
                  onClick={() => selectedSwapIndex !== null && handleSlotClick(index)}
                  className={`w-full h-full flex flex-col items-center justify-center gap-1 ${
                    selectedSwapIndex !== null ? 'cursor-pointer hover:bg-blue-50/50' : ''
                  }`}
                >
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

      {/* 4. Bottom Action Footer */}
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
          <span>{isComplete ? 'Edit & Customize' : `Ambil ${totalSlots - capturedPhotos.length} Foto Lagi`}</span>
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
