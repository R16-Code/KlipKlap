import React, { useState } from 'react';
import { ArrowLeftRight, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { LAYOUT_CONFIGS } from '../../utils/constants';

export const PhotoReorderTray: React.FC = () => {
  const { layout, capturedPhotos, swapPhotos } = useBoothStore();
  const [selectedSwapIndex, setSelectedSwapIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const config = LAYOUT_CONFIGS[layout];
  const totalSlots = config.photoCount;

  if (capturedPhotos.length <= 1) {
    return null;
  }

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

  return (
    <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 overflow-hidden transition-all">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 flex items-center justify-between text-left hover:bg-stone-100/70 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-stone-200/80 flex items-center justify-center text-studio-graphite">
            <ArrowLeftRight className="w-3 h-3" />
          </div>
          <div>
            <span className="text-xs font-bold text-studio-graphite block leading-tight">
              Urutan Foto (Tukar Posisi)
            </span>
            <span className="text-[10px] text-stone-500 font-medium">
              Klik 2 foto atau seret untuk menukar
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {selectedSwapIndex !== null && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold animate-pulse">
              Pilih Target
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-stone-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-500" />
          )}
        </div>
      </button>

      {/* Reorder Thumbnails Grid */}
      {isOpen && (
        <div className="p-2.5 pt-1 border-t border-stone-200/60 bg-white/70 space-y-2">
          {selectedSwapIndex !== null && (
            <div className="p-1.5 bg-blue-50/80 rounded-xl border border-blue-200 text-[10.5px] text-blue-800 flex items-center justify-between">
              <span>
                Foto <strong>0{selectedSwapIndex + 1}</strong> dipilih. Klik foto target untuk menukar:
              </span>
              <button
                type="button"
                onClick={() => setSelectedSwapIndex(null)}
                className="text-[10px] text-blue-600 hover:text-blue-900 underline font-semibold ml-2"
              >
                Batal
              </button>
            </div>
          )}

          <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto no-scrollbar pr-0.5">
            {Array.from({ length: totalSlots }).map((_, slotIdx) => {
              const photo = capturedPhotos.find((p) => p.poseIndex === slotIdx);
              const isSelectedForSwap = selectedSwapIndex === slotIdx;

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
                  className={`relative rounded-xl overflow-hidden border transition-all aspect-[4/3] flex items-center justify-center cursor-pointer select-none group ${
                    isSelectedForSwap
                      ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50 shadow-md scale-95'
                      : photo
                      ? 'border-stone-200/80 bg-stone-900 hover:border-studio-graphite hover:shadow-soft-sm'
                      : 'border-dashed border-stone-300 bg-stone-100/60 opacity-60 hover:border-blue-400'
                  }`}
                  title={photo ? `Foto CUT 0${slotIdx + 1} - Klik untuk tukar posisi` : `Slot kosong - Klik untuk memindahkan foto kesini`}
                >
                  {photo ? (
                    <>
                      <img
                        src={photo.dataUrl}
                        alt={`Pose ${slotIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Slot number badge */}
                      <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/60 backdrop-blur-sm text-[9px] font-mono font-medium text-white">
                        0{slotIdx + 1}
                      </span>

                      {/* Swap overlay icon on hover */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ArrowLeftRight className="w-3.5 h-3.5 text-white" />
                      </div>

                      {/* Selected Indicator */}
                      {isSelectedForSwap && (
                        <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-[9px] font-mono text-stone-400 font-semibold">
                      0{slotIdx + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
