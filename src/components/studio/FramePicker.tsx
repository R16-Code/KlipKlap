import React, { useState, useRef } from 'react';
import { Lock, Crown, Check, Upload, Trash2, HelpCircle, X, ExternalLink, Image as ImageIcon, Download } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { FRAME_OPTIONS } from '../../utils/constants';
import { downloadStarterTemplateGuide } from '../../utils/canvasComposer';
import { SlotCalibrator } from './SlotCalibrator';
import type { FrameCategory, FrameOption } from '../../types';

export const FramePicker: React.FC = () => {
  const { selectedFrame, setSelectedFrame, customFrames, addCustomFrame, removeCustomFrame, layout } = useBoothStore();
  const { isPro, openProModal } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState<FrameCategory | 'all'>('all');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFrameClick = (frameId: string, frameName: string, frameIsPro?: boolean) => {
    if (frameIsPro && !isPro) {
      openProModal(`${frameName} Frame`);
      return;
    }
    setSelectedFrame(frameId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const newFrame: FrameOption = {
        id: `custom_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, '').slice(0, 16),
        category: 'custom',
        color: '#FFFFFF',
        textColor: '#1A1A1A',
        subtextColor: '#737373',
        isCustom: true,
        customImageUrl: dataUrl,
        emoji: '🎨',
        tagline: 'Custom Canva/Figma Template',
      };

      addCustomFrame(newFrame);
      setSelectedFrame(newFrame.id);
      setActiveCategory('custom');
    };
    reader.readAsDataURL(file);

    // Reset input value so same file can be uploaded again if needed
    e.target.value = '';
  };

  const categories: { id: FrameCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'solid', label: 'Solid' },
    { id: 'retro', label: 'Retro 🎞️' },
    { id: 'cute', label: 'Cute 🍒' },
    { id: 'custom', label: `Custom ${customFrames.length > 0 ? `(${customFrames.length})` : '🎨'}` },
  ];

  const allAvailableFrames = [...customFrames, ...FRAME_OPTIONS];

  const filteredFrames = activeCategory === 'all'
    ? allAvailableFrames
    : allAvailableFrames.filter((f) => f.category === activeCategory);

  const currentFrameObj = allAvailableFrames.find((f) => f.id === selectedFrame);

  return (
    <div className="space-y-2.5">
      {/* Header & Guide Button */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-studio-graphite uppercase tracking-wider">
          Frame Design
        </label>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-stone-600 font-medium flex items-center gap-1 max-w-[120px] truncate">
            {currentFrameObj?.emoji && <span>{currentFrameObj.emoji}</span>}
            <span className="truncate">{currentFrameObj?.name}</span>
          </span>
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="p-1 rounded-md text-stone-600 hover:text-studio-graphite hover:bg-stone-200 transition-colors"
            title="Panduan Desain Canva & Figma"
            aria-label="Panduan Desain Canva & Figma"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 p-1 bg-stone-100/80 rounded-xl overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`py-1 px-2 rounded-lg text-[10px] font-semibold transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-white text-studio-graphite shadow-soft-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Upload Custom Frame & Download Template Action Bar */}
      <div className="grid grid-cols-2 gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileUpload}
          className="hidden"
          id="custom-frame-input"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2 px-2.5 rounded-xl border border-dashed border-stone-300 hover:border-studio-graphite bg-stone-50/70 hover:bg-white text-[11px] font-medium text-studio-graphite flex items-center justify-center gap-1.5 transition-all group"
          title="Upload frame PNG transparan dari Canva/Figma"
        >
          <Upload className="w-3.5 h-3.5 text-stone-600 group-hover:text-studio-graphite" />
          <span className="truncate">Upload Frame</span>
        </button>

        <button
          type="button"
          onClick={() => downloadStarterTemplateGuide(layout)}
          className="w-full py-2 px-2.5 rounded-xl border border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-[11px] font-medium text-blue-700 flex items-center justify-center gap-1.5 transition-all group shadow-soft-sm"
          title={`Unduh Starter Template PNG untuk layout ${layout}`}
        >
          <Download className="w-3.5 h-3.5 text-blue-600 group-hover:translate-y-0.5 transition-transform" />
          <span className="truncate">Template Guide</span>
        </button>
      </div>

      {/* Real-Time Photo Slot Position Calibrator (Solution 3) */}
      <SlotCalibrator />

      {/* Frame Cards Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto no-scrollbar pr-0.5">
        {filteredFrames.map((frame) => {
          const isSelected = selectedFrame === frame.id;
          const isLocked = frame.isPro && !isPro;

          return (
            <div
              key={frame.id}
              className={`relative rounded-2xl border text-left transition-all flex flex-col justify-between group ${
                isSelected
                  ? 'border-studio-graphite bg-white ring-1 ring-studio-graphite/20 shadow-soft'
                  : 'border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-stone-300'
              }`}
            >
              <button
                type="button"
                onClick={() => handleFrameClick(frame.id, frame.name, frame.isPro)}
                className="p-2.5 w-full text-left flex flex-col justify-between h-full"
              >
                {/* Header inside button: Color swatch / Thumbnail + Emoji + Lock */}
                <div className="flex items-center justify-between w-full mb-1.5">
                  {frame.customImageUrl ? (
                    <div className="w-6 h-6 rounded-md overflow-hidden border border-black/10 flex items-center justify-center bg-stone-100">
                      <img src={frame.customImageUrl} alt={frame.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full shadow-inner border border-black/10 flex items-center justify-center relative"
                      style={{ backgroundColor: frame.color }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            frame.id === 'matte_charcoal' || frame.id === 'retro_film' || frame.id === 'retro_vhs'
                              ? 'text-white'
                              : 'text-stone-900'
                          }`}
                        />
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    {frame.emoji && <span className="text-xs">{frame.emoji}</span>}
                    {isLocked && (
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
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

                {/* Pro Badge */}
                {frame.isPro && (
                  <div className="mt-1.5 flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded-full w-fit uppercase">
                    <Crown className="w-2.5 h-2.5" />
                    <span>Pro</span>
                  </div>
                )}
              </button>

              {/* Delete button for user's custom frames */}
              {frame.isCustom && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCustomFrame(frame.id);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-md text-stone-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  title="Hapus Frame Custom"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          MODAL: PANDUAN DESAIN CUSTOM FRAME DARI CANVA & FIGMA
          ========================================================================= */}
      {showGuideModal && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-popIn"
        >
          <div 
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200/80 relative max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Close guide dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 id="guide-modal-title" className="text-base font-bold text-studio-graphite">
                  Panduan Membuat Custom Frame (Canva & Figma)
                </h3>
                <p className="text-xs text-stone-600">
                  Desain frame photobooth sesukamu dan upload langsung ke KlipKlap
                </p>
              </div>
            </div>

            {/* Step-by-Step Guide */}
            <div className="space-y-4 text-xs text-stone-700">
              {/* Solusi 1: Direct Download Blueprint Card */}
              <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200/80 flex items-center justify-between gap-3 shadow-soft-sm">
                <div>
                  <span className="font-bold text-blue-900 block text-xs">
                    Template Blueprint Acuan (300 DPI)
                  </span>
                  <p className="text-[11px] text-blue-700/90 leading-tight mt-0.5">
                    Garis putus-putus slot foto sudah disesuaikan otomatis untuk layout aktif ({layout.toUpperCase()}).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadStarterTemplateGuide(layout)}
                  className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 whitespace-nowrap shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Blueprint</span>
                </button>
              </div>

              {/* Step 1 */}
              <div className="p-3.5 bg-studio-milk rounded-2xl border border-stone-200/70">
                <span className="font-bold text-studio-graphite block mb-1">
                  1. Ukuran Kanvas Rekomendasi (300 DPI)
                </span>
                <p className="text-stone-600 leading-relaxed mb-2">
                  Buat dokumen baru di Canva atau Figma dengan ukuran pixel berikut:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="font-bold block text-studio-graphite">Classic Strip 1×4</span>
                    <span className="font-mono text-stone-500">1200 × 3600 px (1:3)</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="font-bold block text-studio-graphite">Trio Strip 1×3</span>
                    <span className="font-mono text-stone-500">1200 × 2875 px (1:2.4)</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="font-bold block text-studio-graphite">Studio Grid 2×2</span>
                    <span className="font-mono text-stone-500">1900 × 2250 px (Square)</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="font-bold block text-studio-graphite">Duo Strip 1×2</span>
                    <span className="font-mono text-stone-500">1200 × 2100 px (1:1.7)</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 bg-studio-milk rounded-2xl border border-stone-200/70">
                <span className="font-bold text-studio-graphite block mb-1">
                  2. Buat Lubang Transparan untuk Foto
                </span>
                <p className="text-stone-600 leading-relaxed">
                  Hiasi sekeliling strip dengan stiker lucu, doodle, teks, atau pita. Pada area tempat foto muncul, biarkan <strong>transparan (bolong / alpha = 0)</strong>. KlipKlap akan otomatis menempatkan foto kamera di bawah lapisan frame Anda!
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 bg-studio-milk rounded-2xl border border-stone-200/70">
                <span className="font-bold text-studio-graphite block mb-1">
                  3. Export sebagai PNG Transparan
                </span>
                <p className="text-stone-600 leading-relaxed">
                  Di Canva: Klik <em>Share ➔ Download ➔ File type: PNG ➔ Centang "Transparent background"</em>.
                  <br />
                  Di Figma: Pilih frame ➔ hilangkan Fill background ➔ Export sebagai <em>PNG</em>.
                </p>
              </div>

              {/* Step 4: Rekomendasi Sumber */}
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/60">
                <span className="font-bold text-amber-900 block mb-1 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Sumber Inspirasi & Template Gratis</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-stone-700 text-[11px]">
                  <li><strong>Pinterest</strong>: Cari kata kunci <em>"korean photobooth frame template canva"</em> atau <em>"life four cuts figma"</em>.</li>
                  <li><strong>Canva</strong>: Cari template dengan kata kunci <em>"Photostrip"</em> atau <em>"Photobooth template"</em>.</li>
                  <li><strong>Figma Community</strong>: Cari <em>"Photobooth 4 cuts strip"</em> untuk template siap pakai.</li>
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="py-2.5 px-5 rounded-xl bg-studio-charcoal text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                Mengerti & Mulai Desain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
