import React, { useState } from 'react';
import { Trash2, FlipHorizontal, RotateCw, RotateCcw, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { STICKER_CATALOG } from '../../utils/stickers';
import type { StickerCategory } from '../../types';

export const StickerPicker: React.FC = () => {
  const {
    placedStickers,
    selectedStickerId,
    addSticker,
    updateSticker,
    removeSticker,
    clearStickers,
  } = useBoothStore();

  const [activeCategory, setActiveCategory] = useState<StickerCategory>('cute');

  const categories: { id: StickerCategory; label: string }[] = [
    { id: 'cute', label: 'Cute 🎀' },
    { id: 'props', label: 'Props 👑' },
    { id: 'y2k', label: 'Y2K ✨' },
    { id: 'stamps', label: 'Stamps 🏷️' },
  ];

  const filteredStickers = STICKER_CATALOG.filter((s) => s.category === activeCategory);
  const selectedSticker = placedStickers.find((s) => s.id === selectedStickerId);
  const selectedStickerDef = selectedSticker
    ? STICKER_CATALOG.find((d) => d.id === selectedSticker.stickerId)
    : null;

  return (
    <div className="space-y-2.5 pt-2 border-t border-stone-200/60">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-studio-graphite uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Stickers & Props</span>
        </label>
        {placedStickers.length > 0 ? (
          <button
            type="button"
            onClick={clearStickers}
            className="text-[10.5px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Hapus Semua ({placedStickers.length})</span>
          </button>
        ) : (
          <span className="text-[10.5px] text-stone-500 font-medium">Klik untuk tempel</span>
        )}
      </div>

      {/* Category Pills (4-Col Grid - Never Cut Off) */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100/80 rounded-xl">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold transition-all text-center truncate ${
              activeCategory === cat.id
                ? 'bg-white text-studio-graphite shadow-soft-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sticker Catalog Grid */}
      <div className="grid grid-cols-3 gap-2 max-h-44 overflow-y-auto no-scrollbar pr-0.5">
        {filteredStickers.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            onClick={() => addSticker(sticker.id)}
            className="p-2 rounded-2xl border border-stone-200/80 bg-stone-50/60 hover:bg-white hover:border-studio-graphite hover:shadow-soft-sm transition-all flex flex-col items-center justify-center gap-1 group active:scale-95"
          >
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <img
                src={sticker.svgDataUrl}
                alt={sticker.name}
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            </div>
            <span className="text-[9.5px] font-semibold text-stone-700 truncate w-full text-center">
              {sticker.name}
            </span>
          </button>
        ))}
      </div>

      {/* Active Selected Sticker Inspector Controls */}
      {selectedSticker && (
        <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              {selectedStickerDef && (
                <img
                  src={selectedStickerDef.svgDataUrl}
                  alt={selectedStickerDef.name}
                  className="w-5 h-5 object-contain shrink-0"
                />
              )}
              <span className="text-[11px] font-bold text-studio-graphite truncate">
                Edit: {selectedStickerDef?.name || 'Stiker'}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() =>
                  updateSticker(selectedSticker.id, { flipX: !selectedSticker.flipX })
                }
                title="Balik Horizontal"
                className="p-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 active:scale-95"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeSticker(selectedSticker.id)}
                title="Hapus Stiker"
                className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scale Slider */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[10px] text-stone-600 font-medium">
              <span className="flex items-center gap-1">
                <ZoomOut className="w-3 h-3" /> Ukuran <ZoomIn className="w-3 h-3" />
              </span>
              <span className="font-mono text-stone-800">{selectedSticker.scale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.4}
              max={2.5}
              step={0.05}
              value={selectedSticker.scale}
              onChange={(e) =>
                updateSticker(selectedSticker.id, { scale: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
            />
          </div>

          {/* Rotation Slider */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-[10px] text-stone-600 font-medium">
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Putar <RotateCw className="w-3 h-3" />
              </span>
              <span className="font-mono text-stone-800">{Math.round(selectedSticker.rotation)}°</span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={selectedSticker.rotation}
              onChange={(e) =>
                updateSticker(selectedSticker.id, { rotation: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
            />
          </div>
        </div>
      )}

      {placedStickers.length > 0 && !selectedSticker && (
        <p className="text-[10px] text-stone-500 text-center italic">
          Klik/geser stiker di atas foto untuk mengatur posisi & ukuran
        </p>
      )}
    </div>
  );
};

