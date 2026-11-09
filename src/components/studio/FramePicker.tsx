import React, { useState, useRef } from 'react';
import { Check, Upload, Image as ImageIcon, Trash2, Sun, Moon, Loader2, RotateCcw, Move } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { FRAME_OPTIONS, BACKGROUND_PATTERNS } from '../../utils/constants';
import { optimizeBackgroundImage } from '../../utils/imageOptimizer';
import { SlotCalibrator } from './SlotCalibrator';
import type { FrameCategory, BackgroundPatternOption } from '../../types';

export const FramePicker: React.FC = () => {
  const { selectedFrame, setSelectedFrame, customBackground, setCustomBackground } = useBoothStore();
  const [activeCategory, setActiveCategory] = useState<FrameCategory | 'all'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories: { id: FrameCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'solid', label: 'Solid' },
    { id: 'pattern', label: 'Motif 🏁' },
    { id: 'retro', label: 'Retro 🎞️' },
    { id: 'cute', label: 'Cute 🍒' },
    { id: 'y2k', label: 'Y2K 👾' },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Auto-compress & downscale image for low-end device safety
      const dataUrl = await optimizeBackgroundImage(file, 1600);
      setCustomBackground({
        type: 'upload',
        imageUrl: dataUrl,
        textColor: 'dark',
        offsetX: 0,
        offsetY: 0,
        zoom: 1,
      });
    } catch (err) {
      console.error('Failed to process image:', err);
      alert('Gagal memproses gambar. Pastikan format file adalah gambar valid (JPG, PNG, atau WEBP).');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelectPattern = (pattern: BackgroundPatternOption) => {
    setCustomBackground({
      type: 'preset',
      presetId: pattern.id,
      textColor: pattern.textColor,
    });
  };

  const handleSelectFrame = (frameId: string) => {
    // Automatically resets custom background so standard frame themes apply immediately
    setSelectedFrame(frameId);
  };

  const toggleUploadTextContrast = () => {
    if (customBackground?.type === 'upload') {
      setCustomBackground({
        ...customBackground,
        textColor: customBackground.textColor === 'light' ? 'dark' : 'light',
      });
    }
  };

  const currentFrameObj = FRAME_OPTIONS.find((f) => f.id === selectedFrame);
  const currentPatternObj = customBackground?.type === 'preset'
    ? BACKGROUND_PATTERNS.find((p) => p.id === customBackground.presetId)
    : null;

  return (
    <div className="space-y-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-studio-graphite uppercase tracking-wider">
          Frame & Background
        </label>
        <span className="text-[11px] text-stone-600 font-medium flex items-center gap-1 max-w-[140px] truncate">
          {customBackground?.type === 'upload' ? (
            <span className="text-amber-800 font-semibold truncate">Custom Upload</span>
          ) : currentPatternObj ? (
            <>
              <span>{currentPatternObj.emoji}</span>
              <span className="truncate">{currentPatternObj.name}</span>
            </>
          ) : (
            <>
              {currentFrameObj?.emoji && <span>{currentFrameObj.emoji}</span>}
              <span className="truncate">{currentFrameObj?.name}</span>
            </>
          )}
        </span>
      </div>

      {/* Custom Upload Card Section */}
      <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 shadow-soft-sm transition-all">
        {customBackground?.type === 'upload' ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-black/15 shrink-0 bg-stone-200 relative shadow-inner">
                  <img
                    src={customBackground.imageUrl}
                    alt="Custom Background"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-studio-graphite truncate flex items-center gap-1">
                    <span>Custom Foto Aktif</span>
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </p>
                  <p className="text-[10px] text-stone-500 truncate">
                    Atur posisi & kontras teks
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Text Contrast Toggle (Dark / Light) */}
                <button
                  type="button"
                  onClick={toggleUploadTextContrast}
                  title={customBackground.textColor === 'light' ? 'Teks Terang (Klik untuk Ganti ke Gelap)' : 'Teks Gelap (Klik untuk Ganti ke Terang)'}
                  className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 shadow-soft-sm transition-all active:scale-95 flex items-center gap-1 text-[10.5px] font-semibold"
                >
                  {customBackground.textColor === 'light' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Terang</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Gelap</span>
                    </>
                  )}
                </button>

                {/* Change Image Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  title="Ganti Gambar"
                  className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 shadow-soft-sm transition-all active:scale-95"
                >
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                </button>

                {/* Delete / Clear Custom Image */}
                <button
                  type="button"
                  onClick={() => setCustomBackground(null)}
                  title="Hapus Custom Background"
                  className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 shadow-soft-sm transition-all active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Background Position & Zoom Sliders */}
            <div className="pt-2 border-t border-stone-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1">
                  <Move className="w-3 h-3 text-stone-500" />
                  <span>Sesuaikan Posisi Background</span>
                </span>
                {((customBackground.offsetX ?? 0) !== 0 ||
                  (customBackground.offsetY ?? 0) !== 0 ||
                  (customBackground.zoom ?? 1) !== 1) && (
                  <button
                    type="button"
                    onClick={() =>
                      setCustomBackground({
                        ...customBackground,
                        offsetX: 0,
                        offsetY: 0,
                        zoom: 1,
                      })
                    }
                    className="text-[10px] font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-0.5"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Horizontal Pan Slider */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[10px] text-stone-600 font-medium">
                  <span>Geser Kiri ↔ Kanan</span>
                  <span className="font-mono text-stone-800">{customBackground.offsetX ?? 0}%</span>
                </div>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  step={1}
                  value={customBackground.offsetX ?? 0}
                  onChange={(e) =>
                    setCustomBackground({
                      ...customBackground,
                      offsetX: Number(e.target.value),
                    })
                  }
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
                />
              </div>

              {/* Vertical Pan Slider */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[10px] text-stone-600 font-medium">
                  <span>Geser Atas ↔ Bawah</span>
                  <span className="font-mono text-stone-800">{customBackground.offsetY ?? 0}%</span>
                </div>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  step={1}
                  value={customBackground.offsetY ?? 0}
                  onChange={(e) =>
                    setCustomBackground({
                      ...customBackground,
                      offsetY: Number(e.target.value),
                    })
                  }
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
                />
              </div>

              {/* Zoom Slider */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[10px] text-stone-600 font-medium">
                  <span>Perbesar (Zoom)</span>
                  <span className="font-mono text-stone-800">{(customBackground.zoom ?? 1).toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={2.5}
                  step={0.05}
                  value={customBackground.zoom ?? 1}
                  onChange={(e) =>
                    setCustomBackground({
                      ...customBackground,
                      zoom: Number(e.target.value),
                    })
                  }
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
                />
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-2 px-3 rounded-xl border border-dashed border-stone-300 hover:border-studio-graphite hover:bg-white text-stone-700 transition-all flex items-center justify-center gap-2 group active:scale-98"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-studio-graphite" />
                <span className="text-xs font-semibold">Mengompres & Menyiapkan Gambar...</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 rounded-lg bg-stone-200/80 group-hover:bg-studio-charcoal group-hover:text-white flex items-center justify-center transition-colors">
                  <ImageIcon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-studio-graphite block leading-tight">
                    Upload Background Sendiri
                  </span>
                  <span className="text-[9.5px] text-stone-500 block leading-tight">
                    Foto, motif, atau wallpaper dari perangkat
                  </span>
                </div>
              </>
            )}
          </button>
        )}
      </div>

      {/* Category Pills (3x2 Grid - Zero Cut-off, No Shift-Scroll Needed) */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100/80 rounded-xl">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`py-1.5 px-2 rounded-lg text-[10.5px] font-semibold transition-all text-center truncate ${
              activeCategory === cat.id
                ? 'bg-white text-studio-graphite shadow-soft-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Frame / Pattern Cards Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto no-scrollbar pr-0.5">
        {/* Render Preset Patterns when in 'all' or 'pattern' category */}
        {(activeCategory === 'all' || activeCategory === 'pattern') &&
          BACKGROUND_PATTERNS.map((pattern) => {
            const isSelected =
              customBackground?.type === 'preset' && customBackground.presetId === pattern.id;

            return (
              <button
                key={pattern.id}
                type="button"
                onClick={() => handleSelectPattern(pattern)}
                className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-studio-graphite bg-white ring-1 ring-studio-graphite/20 shadow-soft'
                    : 'border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-stone-300'
                }`}
              >
                {/* Header: Swatch + Emoji */}
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div
                    className={`w-6 h-6 rounded-full shadow-inner flex items-center justify-center relative overflow-hidden ${pattern.previewBg}`}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          pattern.textColor === 'light' ? 'text-white' : 'text-stone-900'
                        }`}
                      />
                    )}
                  </div>
                  <span className="text-xs">{pattern.emoji}</span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <p className="text-xs font-semibold text-studio-graphite truncate leading-tight">
                    {pattern.name}
                  </p>
                  <p className="text-[9.5px] text-stone-500 truncate mt-0.5 leading-snug">
                    {pattern.tagline}
                  </p>
                </div>
              </button>
            );
          })}

        {/* Render Standard Solid & Themed Frames (unless category is specifically 'pattern') */}
        {activeCategory !== 'pattern' &&
          (activeCategory === 'all'
            ? FRAME_OPTIONS
            : FRAME_OPTIONS.filter((f) => f.category === activeCategory)
          ).map((frame) => {
            const isSelected = !customBackground && selectedFrame === frame.id;

            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => handleSelectFrame(frame.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-studio-graphite bg-white ring-1 ring-studio-graphite/20 shadow-soft'
                    : 'border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-stone-300'
                }`}
              >
                {/* Header: Color swatch / Thumbnail + Emoji */}
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div
                    className="w-6 h-6 rounded-full shadow-inner border border-black/10 flex items-center justify-center relative"
                    style={{ backgroundColor: frame.color }}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          [
                            'matte_charcoal',
                            'midnight_navy',
                            'wine_bordeaux',
                            'retro_film',
                            'retro_cassette',
                            'retro_vhs',
                            'cocoa_muted',
                            'y2k_holo',
                            'y2k_pixel',
                            'y2k_cyberpunk',
                            'y2k_glitter_star',
                          ].includes(frame.id)
                            ? 'text-white'
                            : 'text-stone-900'
                        }`}
                      />
                    )}
                  </div>

                  {frame.emoji && <span className="text-xs">{frame.emoji}</span>}
                </div>

                {/* Title & Tagline */}
                <div>
                  <p className="text-xs font-semibold text-studio-graphite truncate leading-tight">
                    {frame.name}
                  </p>
                  {frame.tagline && (
                    <p className="text-[9.5px] text-stone-600 truncate mt-0.5 leading-snug">
                      {frame.tagline}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
      </div>

      {/* Real-Time Photo Slot Position Calibrator */}
      <SlotCalibrator />
    </div>
  );
};
