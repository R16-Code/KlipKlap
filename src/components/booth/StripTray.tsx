import React, { useState } from 'react';
import { RotateCcw, ArrowRight, Camera, Sparkles, Trash2, ArrowLeftRight, Check } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { LAYOUT_CONFIGS } from '../../utils/constants';

export const StripTray: React.FC = () => {
  const {
    layout,
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

  const gridColsClass =
    totalSlots === 9
      ? 'grid-cols-3 gap-1.5'
      : totalSlots === 1
      ? 'grid-cols-1 gap-2 max-w-[240px] mx-auto w-full'
      : 'grid-cols-2 gap-2';

  return (
    <aside aria-label="Photo Strip Roll" className="w-full h-full flex flex-col bg-white/75 backdrop-blur-md rounded-3xl p-4 border border-black/[0.06] shadow-soft overflow-hidden">
      {/* Strip Roll Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold tracking-wider text-studio-graphite uppercase font-sans">
              Strip Roll
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200/60">
              {totalSlots} Poses
            </span>
          </div>
          <p className="text-[10.5px] text-stone-600 font-medium mt-0.5">
            {capturedPhotos.length} of {totalSlots} shots taken • {layoutConfig.name}
          </p>
        </div>

        {capturedPhotos.length > 0 && !isCapturing && (
          <button
            type="button"
            onClick={clearPhotos}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 p-1.5 rounded-xl hover:bg-rose-50 transition-colors"
            title="Hapus semua foto sesi ini"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Swap Position Instructions / Status Hint */}
      {capturedPhotos.length > 1 && !isCapturing && (
        <div className="py-1.5 px-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-[10.5px] text-blue-800 flex items-center justify-between my-2 shrink-0">
          <span className="flex items-center gap-1.5 font-medium leading-tight">
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>
              {selectedSwapIndex !== null
                ? `Klik foto tujuan untuk menukar CUT 0${selectedSwapIndex + 1}`
                : 'Klik 2 foto atau seret untuk menukar urutan'}
            </span>
          </span>
          {selectedSwapIndex !== null && (
            <button
              type="button"
              onClick={() => setSelectedSwapIndex(null)}
              className="text-[10px] text-blue-700 hover:text-blue-900 underline font-bold ml-2 shrink-0"
            >
              Batal
            </button>
          )}
        </div>
      )}

      {/* Thumbnails Multi-Column Grid (All photos visible simultaneously) */}
      <div className={`flex-1 overflow-y-auto no-scrollbar py-2 grid ${gridColsClass} content-start`}>
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
              onClick={() => handleSlotClick(index)}
              className={`relative rounded-2xl overflow-hidden border transition-all aspect-[4/3] flex items-center justify-center cursor-pointer select-none group ${
                isSelectedForSwap
                  ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50 shadow-md scale-[0.98]'
                  : photo
                  ? 'border-stone-200/80 shadow-soft-sm bg-stone-900 hover:border-studio-graphite hover:shadow-md'
                  : 'border-dashed border-stone-300 bg-stone-50/60 hover:bg-stone-100/60'
              }`}
              title={
                photo
                  ? `Foto CUT 0${index + 1} - Klik atau seret untuk menukar posisi`
                  : `Slot CUT 0${index + 1} Kosong`
              }
            >
              {photo ? (
                <>
                  <img
                    src={photo.dataUrl}
                    alt={`Pose Cut ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Slot Number Label */}
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9.5px] font-mono font-medium text-white/90">
                    0{index + 1}
                  </span>

                  {/* Hover Overlay: Swap & Retake Action */}
                  {!isCapturing && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSlotClick(index);
                        }}
                        className="px-2 py-1 rounded-lg bg-white/95 text-studio-graphite text-[10.5px] font-bold flex items-center gap-1 hover:bg-white shadow-soft transition-transform active:scale-95"
                        title="Tukar posisi foto ini"
                      >
                        <ArrowLeftRight className="w-3 h-3 text-stone-700" />
                        <span>Tukar</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          retakeSinglePhoto(index);
                        }}
                        className="p-1 rounded-lg bg-white/95 text-studio-graphite hover:bg-white shadow-soft transition-transform active:scale-95"
                        title="Foto ulang pose ini"
                      >
                        <RotateCcw className="w-3 h-3 text-stone-700" />
                      </button>
                    </div>
                  )}

                  {/* Selected Swap Highlight */}
                  {isSelectedForSwap && (
                    <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center p-1">
                      <div className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                        <Check className="w-3 h-3" />
                        <span>Pilih Target</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-stone-400">
                  <div className="w-7 h-7 rounded-full bg-stone-200/50 flex items-center justify-center text-stone-400">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-stone-400 tracking-wider">
                    CUT 0{index + 1}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-stone-200/60 mt-auto shrink-0">
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
          <span>{isComplete ? 'Edit & Customize in Studio' : `Ambil ${totalSlots - capturedPhotos.length} Foto Lagi`}</span>
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
