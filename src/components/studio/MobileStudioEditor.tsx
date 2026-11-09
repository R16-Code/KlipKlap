import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Download,
  LayoutGrid,
  Palette,
  Sparkles,
  Type,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  Check,
  Calendar,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  Heart,
  Video,
  Upload,
  Image as ImageIcon,
  Sun,
  Moon,
  Loader2,
  Smile,
  FlipHorizontal,
  RotateCcw,
  Move,
  ImagePlus,
  Info,
} from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { FRAME_OPTIONS, FILTER_OPTIONS, LAYOUT_CONFIGS, BACKGROUND_PATTERNS } from '../../utils/constants';
import { STICKER_CATALOG } from '../../utils/stickers';
import { downloadHighResPhotostrip, downloadLiveMotionGIF, downloadLiveMotionMP4 } from '../../utils/canvasComposer';
import { optimizeBackgroundImage, optimizeStickerImage } from '../../utils/imageOptimizer';
import { EditorCanvas } from './EditorCanvas';
import { SlotCalibrator } from './SlotCalibrator';
import confetti from 'canvas-confetti';
import type { LayoutType, FrameCategory, FilterType, StickerCategory } from '../../types';

export const MobileStudioEditor: React.FC = () => {
  const {
    capturedPhotos,
    layout,
    setLayout,
    selectedFrame,
    setSelectedFrame,
    customBackground,
    setCustomBackground,
    placedStickers,
    customStickers,
    selectedStickerId,
    addSticker,
    addCustomSticker,
    updateSticker,
    removeSticker,
    clearStickers,
    selectedFilter,
    setSelectedFilter,
    studioSettings,
    updateStudioSettings,
    setCurrentStep,
    resetSession,
    setPreviewMode,
    timerDuration,
    studioVideoElements,
    setIsExportingVideo: setGlobalIsExportingVideo,
  } = useBoothStore();

  const [activeTab, setActiveTab] = useState<'layouts' | 'frames' | 'stickers' | 'filters' | 'caption' | null>(null);
  const [frameCategory, setFrameCategory] = useState<FrameCategory | 'all'>('all');
  const [stickerCategory, setStickerCategory] = useState<StickerCategory>('cute');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingSticker, setIsUploadingSticker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileStickerInputRef = useRef<HTMLInputElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [videoSuccess, setVideoSuccess] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'mp4' | 'gif' | null>(null);
  const [isMotionModalOpen, setIsMotionModalOpen] = useState(false);

  const layoutKeys: LayoutType[] = [
    'strip_1x4',
    'strip_1x3',
    'grid_2x2',
    'grid_3x3',
    'grid_2x3',
    'strip_1x2',
    'polaroid_1x1',
  ];

  const frameCategories: { id: FrameCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'solid', label: 'Solid' },
    { id: 'pattern', label: 'Motif 🏁' },
    { id: 'retro', label: 'Retro 🎞️' },
    { id: 'cute', label: 'Cute 🍒' },
    { id: 'y2k', label: 'Y2K 👾' },
  ];

  const filteredFrames =
    frameCategory === 'all'
      ? FRAME_OPTIONS
      : FRAME_OPTIONS.filter((f) => f.category === frameCategory);

  const layoutConfig = LAYOUT_CONFIGS[layout];
  const requiredPhotos = layoutConfig.photoCount;
  const isIncomplete = capturedPhotos.length < requiredPhotos;

  const handleMobileFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
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
      alert('Gagal memproses gambar. Pastikan format file adalah gambar valid.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleMobileStickerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingSticker(true);
      const optimizedPng = await optimizeStickerImage(file, 512);
      const cleanName = file.name.replace(/\.[^/.]+$/, '').slice(0, 16);
      addCustomSticker(optimizedPng, cleanName || 'Stiker Saya');
    } catch (err) {
      console.error('Failed to process custom sticker:', err);
      alert('Gagal memproses stiker. Pastikan format file PNG atau WebP.');
    } finally {
      setIsUploadingSticker(false);
      if (mobileStickerInputRef.current) mobileStickerInputRef.current.value = '';
    }
  };

  const handleDownload = async () => {
    if (isExporting || capturedPhotos.length === 0) return;

    if (isIncomplete) {
      const proceed = window.confirm(
        `Foto belum lengkap: Baru ada ${capturedPhotos.length} dari ${requiredPhotos} slot foto.\n\nTetap download dengan slot kosong?`
      );
      if (!proceed) return;
    }

    try {
      setIsExporting(true);
      await downloadHighResPhotostrip(
        {
          photos: capturedPhotos,
          layout,
          frameId: selectedFrame,
          filter: selectedFilter,
          settings: studioSettings,
          scale: 2.5,
          customBackground,
          placedStickers,
        },
        'png'
      );

      setDownloadSuccess(true);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#E65D47', '#C5A880', '#262626', '#F5F3ED'],
      });

      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to export:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadMotion = async (format: 'mp4' | 'gif') => {
    if (isExporting || isExportingVideo || capturedPhotos.length === 0) return;

    if (isIncomplete) {
      const proceed = window.confirm(
        `Foto belum lengkap: Baru ada ${capturedPhotos.length} dari ${requiredPhotos} slot foto.\n\nTetap ekspor Live Motion (${format.toUpperCase()}) sekarang?`
      );
      if (!proceed) return;
    }

    try {
      setActiveFormat(format);
      setIsExportingVideo(true);
      setGlobalIsExportingVideo(true);
      setVideoProgress(0);
      setPreviewMode('motion');

      const exportOptions = {
        photos: capturedPhotos,
        layout,
        frameId: selectedFrame,
        filter: selectedFilter,
        settings: studioSettings,
        durationSeconds: timerDuration,
        videoElements: studioVideoElements || undefined,
        customBackground,
        placedStickers,
      };

      if (format === 'mp4') {
        await downloadLiveMotionMP4(exportOptions, (progress) => setVideoProgress(progress));
      } else {
        await downloadLiveMotionGIF(exportOptions, (progress) => setVideoProgress(progress));
      }

      setVideoSuccess(true);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#F59E0B', '#E65D47', '#3B82F6', '#10B981'],
      });

      setTimeout(() => {
        setVideoSuccess(false);
        setActiveFormat(null);
      }, 3500);
    } catch (err) {
      console.error(`Failed to export Live Motion ${format.toUpperCase()}:`, err);
      alert(`Gagal mengekspor Live Motion ${format.toUpperCase()}.`);
    } finally {
      setIsExportingVideo(false);
      setGlobalIsExportingVideo(false);
    }
  };

  const getFilterGradient = (id: FilterType) => {
    switch (id) {
      case 'bw':
        return 'from-neutral-900 to-neutral-200';
      case 'sepia':
        return 'from-[#4A3222] to-[#FCEFDA]';
      case 'grain':
        return 'from-stone-800 to-stone-300';
      case 'pastel':
        return 'from-pink-300 to-purple-200';
      case 'fuji':
        return 'from-emerald-600 to-sky-300';
      case 'cyber':
        return 'from-cyan-500 to-violet-600';
      case 'cinema':
        return 'from-[#0F303B] to-[#E9B171]';
      case 'soft':
        return 'from-[#FFF5EE] to-[#F8D7DA]';
      case 'kodak':
        return 'from-[#B45309] to-[#FEF3C7]';
      case 'moody_noir':
        return 'from-black to-zinc-400';
      case 'haru_blue':
        return 'from-[#3B82F6] to-[#EFF6FF]';
      case 'cherry_blossom':
        return 'from-[#F43F5E] to-[#FFF1F2]';
      case 'warm_latte':
        return 'from-[#78350F] to-[#FEF3C7]';
      case 'vintage_90s':
        return 'from-[#EA580C] to-[#38BDF8]';
      default:
        return 'from-rose-200 to-sky-100';
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none">
      {/* Top Mobile Bar */}
      <header className="h-14 px-3 sm:px-4 bg-studio-milk/95 backdrop-blur-md border-b border-black/[0.06] flex items-center justify-between shrink-0 z-30">
        <button
          type="button"
          onClick={() => setCurrentStep('booth')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[40px] rounded-xl text-stone-700 hover:text-black font-semibold text-xs bg-white/80 border border-stone-200 shadow-soft-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Booth</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="font-bold tracking-tight text-sm text-studio-graphite font-sans">
            KLIPKLAP
          </span>
          <span className="text-[9px] tracking-widest px-1.5 py-0.5 rounded bg-studio-sand text-stone-600 font-semibold uppercase">
            STUDIO
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 bg-white/90 border border-stone-200 shadow-soft-sm shrink-0">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
          <span className="hidden xs:inline">100% Free Photobooth</span>
          <span className="xs:hidden">100% Free</span>
        </div>
      </header>

      {/* Center Viewport: Realistic Scaled Photostrip Canvas */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col items-center justify-start sm:justify-center p-2 relative overscroll-contain">
        <EditorCanvas isDrawerOpen={activeTab !== null} />
      </div>

      {/* Bottom Drawer & Tab Bar Container */}
      <div className="shrink-0 bg-white/95 backdrop-blur-lg border-t border-black/[0.08] shadow-soft-lg flex flex-col z-30">
        {/* Expandable Drawer Panel (when a tab is selected) */}
        {activeTab !== null && (
          <div className="p-3 border-b border-stone-200/70 max-h-44 sm:max-h-48 overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-200">
            {/* Tab Close Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-studio-graphite uppercase tracking-wider font-sans">
                {activeTab === 'layouts'
                  ? 'Pilih Layout'
                  : activeTab === 'frames'
                  ? 'Frame Color & Theme'
                  : activeTab === 'stickers'
                  ? 'Stickers & Props'
                  : activeTab === 'filters'
                  ? 'Filter Preset'
                  : 'Caption & Archive Stamp'}
              </span>
              <button
                type="button"
                onClick={() => setActiveTab(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
                title="Tutup drawer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* TAB 1: LAYOUTS */}
            {activeTab === 'layouts' && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {layoutKeys.map((key) => {
                  const cfg = LAYOUT_CONFIGS[key];
                  const isSelected = layout === key;
                  const diff = cfg.photoCount - capturedPhotos.length;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setLayout(key)}
                      className={`p-2 rounded-xl border text-left shrink-0 min-w-[100px] transition-all active:scale-95 ${
                        isSelected
                          ? 'border-studio-graphite bg-white ring-1 ring-studio-graphite shadow-soft'
                          : 'border-stone-200 bg-stone-50/80 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-studio-graphite truncate">{cfg.name}</div>
                      <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1">
                        <span>{cfg.photoCount} cuts</span>
                        {diff > 0 && (
                          <span className="text-amber-800 font-bold bg-amber-100 px-1 rounded text-[9px]">
                            +{diff}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB 2: FRAMES */}
            {activeTab === 'frames' && (
              <div className="space-y-2">
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleMobileFileUpload}
                  className="hidden"
                />

                {/* Mobile Custom Upload Header / Card */}
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 shadow-soft-sm">
                  {customBackground?.type === 'upload' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-black/15 shrink-0 bg-stone-200">
                            <img
                              src={customBackground.imageUrl}
                              alt="Custom Background"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-studio-graphite truncate flex items-center gap-1">
                              <span>Custom Foto</span>
                              <Check className="w-3 h-3 text-emerald-600" />
                            </p>
                            <p className="text-[9.5px] text-stone-500 truncate">
                              Geser slider untuk atur posisi
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Contrast Toggle */}
                          <button
                            type="button"
                            onClick={() =>
                              setCustomBackground({
                                ...customBackground,
                                textColor: customBackground.textColor === 'light' ? 'dark' : 'light',
                              })
                            }
                            className="px-2 py-1 rounded-lg border border-stone-200 bg-white text-stone-700 text-[10px] font-semibold flex items-center gap-1"
                          >
                            {customBackground.textColor === 'light' ? (
                              <>
                                <Sun className="w-3 h-3 text-amber-500" />
                                <span>Terang</span>
                              </>
                            ) : (
                              <>
                                <Moon className="w-3 h-3 text-indigo-500" />
                                <span>Gelap</span>
                              </>
                            )}
                          </button>

                          {/* Change image */}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-700"
                          >
                            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          </button>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => setCustomBackground(null)}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Position & Zoom Sliders for Uploaded Background */}
                      <div className="pt-1.5 border-t border-stone-200/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1">
                            <Move className="w-3 h-3 text-stone-500" />
                            <span>Atur Posisi & Zoom Background</span>
                          </span>
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
                            className="text-[9.5px] font-semibold text-stone-500 flex items-center gap-0.5"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span>Reset</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <div className="flex justify-between text-[9px] text-stone-500">
                              <span>Geser X</span>
                              <span className="font-mono">{Math.round((customBackground.offsetX ?? 0) * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min={-1}
                              max={1}
                              step={0.02}
                              value={customBackground.offsetX ?? 0}
                              onChange={(e) =>
                                setCustomBackground({
                                  ...customBackground,
                                  offsetX: parseFloat(e.target.value),
                                })
                              }
                              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-[9px] text-stone-500">
                              <span>Geser Y</span>
                              <span className="font-mono">{Math.round((customBackground.offsetY ?? 0) * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min={-1}
                              max={1}
                              step={0.02}
                              value={customBackground.offsetY ?? 0}
                              onChange={(e) =>
                                setCustomBackground({
                                  ...customBackground,
                                  offsetY: parseFloat(e.target.value),
                                })
                              }
                              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-[9px] text-stone-500">
                              <span>Zoom</span>
                              <span className="font-mono">{(customBackground.zoom ?? 1).toFixed(1)}x</span>
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
                                  zoom: parseFloat(e.target.value),
                                })
                              }
                              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-dashed border-stone-300 hover:border-studio-graphite bg-white text-stone-700 flex items-center justify-center gap-2 active:scale-98 transition-all"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-studio-graphite" />
                          <span className="text-[11px] font-semibold">Mengompres & Menyiapkan...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
                          <span className="text-[11px] font-bold text-studio-graphite">
                            + Upload Background Foto Sendiri
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Category Pills (3-column grid so nothing gets cut off) */}
                <div className="grid grid-cols-3 gap-1 pb-0.5">
                  {frameCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFrameCategory(cat.id)}
                      className={`px-2 py-1 rounded-lg text-[10.5px] font-semibold text-center truncate transition-all ${
                        frameCategory === cat.id
                          ? 'bg-studio-charcoal text-white shadow-soft-sm'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Horizontal Swatch Cards */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {/* Preset Patterns (when in 'all' or 'pattern') */}
                  {(frameCategory === 'all' || frameCategory === 'pattern') &&
                    BACKGROUND_PATTERNS.map((pattern) => {
                      const isSelected =
                        customBackground?.type === 'preset' && customBackground.presetId === pattern.id;
                      return (
                        <button
                          key={pattern.id}
                          type="button"
                          onClick={() =>
                            setCustomBackground({
                              type: 'preset',
                              presetId: pattern.id,
                              textColor: pattern.textColor,
                            })
                          }
                          className={`p-2 rounded-xl border shrink-0 min-w-[90px] flex flex-col items-center gap-1 transition-all active:scale-95 ${
                            isSelected
                              ? 'border-studio-graphite bg-white ring-1 ring-studio-graphite shadow-soft'
                              : 'border-stone-200 bg-stone-50'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full shadow-inner flex items-center justify-center relative ${pattern.previewBg}`}
                          >
                            {isSelected && (
                              <Check
                                className={`w-3.5 h-3.5 ${
                                  pattern.textColor === 'light' ? 'text-white' : 'text-stone-900'
                                }`}
                              />
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-studio-graphite truncate max-w-[85px]">
                            {pattern.name}
                          </span>
                        </button>
                      );
                    })}

                  {/* Standard Frames */}
                  {frameCategory !== 'pattern' &&
                    filteredFrames.map((frame) => {
                      const isSelected = !customBackground && selectedFrame === frame.id;
                      return (
                        <button
                          key={frame.id}
                          type="button"
                          onClick={() => setSelectedFrame(frame.id)}
                          className={`p-2 rounded-xl border shrink-0 min-w-[90px] flex flex-col items-center gap-1 transition-all active:scale-95 ${
                            isSelected
                              ? 'border-studio-graphite bg-white ring-1 ring-studio-graphite shadow-soft'
                              : 'border-stone-200 bg-stone-50'
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-full shadow-inner border border-black/10 flex items-center justify-center relative"
                            style={{ backgroundColor: frame.color }}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-stone-900" />}
                          </div>
                          <span className="text-[11px] font-bold text-studio-graphite truncate max-w-[85px]">
                            {frame.name}
                          </span>
                        </button>
                      );
                    })}
                </div>

                {/* Calibrator Drawer */}
                <SlotCalibrator />
              </div>
            )}

            {/* TAB 2.5: STICKERS & PROPS */}
            {activeTab === 'stickers' && (
              <div className="space-y-2">
                {/* Hidden File Input for Mobile Sticker Upload */}
                <input
                  ref={mobileStickerInputRef}
                  type="file"
                  accept="image/png,image/webp"
                  onChange={handleMobileStickerUpload}
                  className="hidden"
                />

                {/* Upload Button & Transparency Tip */}
                <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <button
                    type="button"
                    onClick={() => mobileStickerInputRef.current?.click()}
                    disabled={isUploadingSticker}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-studio-charcoal text-white text-[10.5px] font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                  >
                    {isUploadingSticker ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-amber-300" />
                        <span>Memproses Stiker...</span>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="w-3 h-3 text-amber-300" />
                        <span>+ Upload Stiker Sendiri (PNG)</span>
                      </>
                    )}
                  </button>
                  <div className="flex items-center gap-1 text-[9px] text-amber-900/90">
                    <Info className="w-2.5 h-2.5 text-amber-700 shrink-0" />
                    <span>Tips: Gunakan format PNG transparan agar menyatu rapi di atas foto.</span>
                  </div>
                </div>

                {/* Uploaded User Custom Stickers Row (if any) */}
                {customStickers.length > 0 && (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[9px] font-bold text-stone-600 uppercase tracking-wider px-0.5">
                      <span>Stiker Kamu ({customStickers.length})</span>
                      <span className="text-stone-400 font-normal">Ketuk untuk tempel</span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                      {customStickers.map((cSticker) => (
                        <button
                          key={cSticker.id}
                          type="button"
                          onClick={() => addSticker(cSticker.id, cSticker.dataUrl)}
                          className="w-10 h-10 p-1 rounded-xl border border-stone-200 bg-white hover:border-studio-graphite shrink-0 flex items-center justify-center active:scale-95 transition-all"
                          title={`Tempel ${cSticker.name}`}
                        >
                          <img
                            src={cSticker.dataUrl}
                            alt={cSticker.name}
                            className="w-full h-full object-contain pointer-events-none"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Tabs + Clear All */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="grid grid-cols-4 gap-1 flex-1">
                    {(
                      [
                        { id: 'cute', label: 'Cute 🎀' },
                        { id: 'props', label: 'Props 🕶️' },
                        { id: 'y2k', label: 'Y2K ✨' },
                        { id: 'stamps', label: 'Stamps 💌' },
                      ] as { id: StickerCategory; label: string }[]
                    ).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setStickerCategory(cat.id)}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-semibold text-center truncate transition-all ${
                          stickerCategory === cat.id
                            ? 'bg-studio-charcoal text-white shadow-soft-sm'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {placedStickers.length > 0 && (
                    <button
                      type="button"
                      onClick={clearStickers}
                      className="px-2 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-semibold shrink-0"
                    >
                      Reset ({placedStickers.length})
                    </button>
                  )}
                </div>

                {/* Horizontal Sticker Catalog */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {STICKER_CATALOG.filter((s) => s.category === stickerCategory).map((sticker) => (
                    <button
                      key={sticker.id}
                      type="button"
                      onClick={() => addSticker(sticker.id)}
                      className="p-2 rounded-xl border border-stone-200 bg-stone-50 shrink-0 min-w-[76px] flex flex-col items-center gap-1 active:scale-95 transition-all"
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        <img
                          src={sticker.svgDataUrl}
                          alt={sticker.name}
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-stone-700 truncate max-w-[70px]">
                        {sticker.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Selected Sticker Quick Controls */}
                {(() => {
                  const activeSticker = placedStickers.find((s) => s.id === selectedStickerId);
                  if (!activeSticker) {
                    return (
                      <p className="text-[10px] text-stone-500 text-center">
                        Ketuk stiker untuk menambahkan, lalu geser langsung di atas frame.
                      </p>
                    );
                  }
                  return (
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-2">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <div className="flex justify-between text-[9px] text-stone-500">
                            <span>Ukuran</span>
                            <span className="font-mono">{Math.round(activeSticker.scale * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min={0.4}
                            max={2.4}
                            step={0.05}
                            value={activeSticker.scale}
                            onChange={(e) =>
                              updateSticker(activeSticker.id, { scale: parseFloat(e.target.value) })
                            }
                            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[9px] text-stone-500">
                            <span>Putar</span>
                            <span className="font-mono">{Math.round(activeSticker.rotation)}°</span>
                          </div>
                          <input
                            type="range"
                            min={-180}
                            max={180}
                            step={2}
                            value={activeSticker.rotation}
                            onChange={(e) =>
                              updateSticker(activeSticker.id, { rotation: parseFloat(e.target.value) })
                            }
                            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            updateSticker(activeSticker.id, { flipX: !activeSticker.flipX })
                          }
                          className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-700"
                          title="Balik Horizontal"
                        >
                          <FlipHorizontal className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSticker(activeSticker.id)}
                          className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700"
                          title="Hapus Stiker"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 3: FILTERS */}
            {activeTab === 'filters' && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {FILTER_OPTIONS.map((filter) => {
                  const isSelected = selectedFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`p-2 rounded-xl border shrink-0 min-w-[95px] flex flex-col gap-1 transition-all active:scale-95 ${
                        isSelected
                          ? 'border-studio-graphite bg-white ring-1 ring-studio-graphite shadow-soft'
                          : 'border-stone-200 bg-stone-50'
                      }`}
                    >
                      <div className={`h-6 rounded-md bg-gradient-to-r ${getFilterGradient(filter.id)} shadow-inner border border-black/5`} />
                      <span className="text-[11px] font-bold text-studio-graphite truncate">
                        {filter.name}
                      </span>
                      <span className="text-[9px] text-stone-500">
                        {filter.koreanName}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB 4: CAPTION & SETTINGS */}
            {activeTab === 'caption' && (
              <div className="space-y-2.5 text-xs">
                {/* Subtitle Input */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-700">
                    <span>Subtitle Archive Text</span>
                    <span className="font-mono text-stone-500">{studioSettings.subtitle.length}/28</span>
                  </div>
                  <input
                    type="text"
                    value={studioSettings.subtitle}
                    onChange={(e) => updateStudioSettings({ subtitle: e.target.value.toUpperCase() })}
                    placeholder="SELF PHOTO ARCHIVE"
                    maxLength={28}
                    className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800"
                  />
                </div>

                {/* Date Stamp Toggle */}
                <button
                  type="button"
                  onClick={() => updateStudioSettings({ showDate: !studioSettings.showDate })}
                  className="w-full flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-600" />
                    <span>Tampilkan Tanggal Cetak</span>
                  </div>
                  <div
                    className={`w-8 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                      studioSettings.showDate ? 'bg-studio-charcoal' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        studioSettings.showDate ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </button>

                {/* Privacy Badge */}
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[10.5px] text-emerald-800 flex items-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Foto aman di browser Anda & tidak pernah disimpan ke server.</span>
                </div>

                {/* Clear Session */}
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Hapus seluruh foto dan mulai sesi baru?')) {
                      resetSession();
                    }
                  }}
                  className="w-full py-2 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/60 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Selesai & Hapus Semua Foto</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 5 Bottom Navigation Tabs */}
        <div className="grid grid-cols-5 border-b border-stone-200/60">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'layouts' ? null : 'layouts')}
            className={`py-2.5 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 ${
              activeTab === 'layouts'
                ? 'text-studio-graphite font-bold bg-stone-100/70 border-b-2 border-studio-graphite'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Layouts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'frames' ? null : 'frames')}
            className={`py-2.5 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 ${
              activeTab === 'frames'
                ? 'text-studio-graphite font-bold bg-stone-100/70 border-b-2 border-studio-graphite'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Frames</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'stickers' ? null : 'stickers')}
            className={`py-2.5 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 relative ${
              activeTab === 'stickers'
                ? 'text-studio-graphite font-bold bg-stone-100/70 border-b-2 border-studio-graphite'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Stickers</span>
            {placedStickers.length > 0 && (
              <span className="absolute top-1.5 right-3 w-3.5 h-3.5 rounded-full bg-studio-charcoal text-white text-[8px] font-bold flex items-center justify-center">
                {placedStickers.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'filters' ? null : 'filters')}
            className={`py-2.5 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 ${
              activeTab === 'filters'
                ? 'text-studio-graphite font-bold bg-stone-100/70 border-b-2 border-studio-graphite'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Filters</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'caption' ? null : 'caption')}
            className={`py-2.5 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 ${
              activeTab === 'caption'
                ? 'text-studio-graphite font-bold bg-stone-100/70 border-b-2 border-studio-graphite'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Type className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Caption</span>
          </button>
        </div>

        {/* Pinned Bottom Primary Action Bar with Safe-Area Inset */}
        <div className="p-3 pb-safe bg-white flex flex-col gap-1.5">
          {isIncomplete && (
            <div className="flex items-center justify-between text-[11px] text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <span className="flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Foto kurang {requiredPhotos - capturedPhotos.length}</span>
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep('booth')}
                className="underline font-bold text-amber-950"
              >
                Ambil Lagi
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Button 1: Download Foto (PNG) */}
            <button
              type="button"
              disabled={isExporting || isExportingVideo}
              onClick={handleDownload}
              className={`flex-1 py-3 min-h-[46px] px-2 rounded-2xl text-xs font-bold tracking-tight uppercase flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98] ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-studio-charcoal text-white hover:bg-black'
              }`}
            >
              {isExporting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span className="text-[11px]">PNG...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span className="text-[11px]">Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span className="text-[11px]">Foto (PNG)</span>
                </>
              )}
            </button>

            {/* Button 2: Download Live Motion (Modal Trigger for MP4 or GIF) */}
            <button
              type="button"
              disabled={isExporting || isExportingVideo}
              onClick={() => {
                if (!isExporting && !isExportingVideo) {
                  setIsMotionModalOpen(true);
                }
              }}
              className={`flex-1 py-3 min-h-[46px] px-2 rounded-2xl text-xs font-bold tracking-tight uppercase flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98] border ${
                videoSuccess
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 border-amber-300/80'
              }`}
              title="Download photostrip Live Motion (Pilih MP4 atau GIF)"
            >
              {isExportingVideo ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
                  <span className="text-[11px]">{activeFormat === 'mp4' ? 'MP4' : 'GIF'} ({videoProgress}%)...</span>
                </>
              ) : videoSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-[11px]">Tersimpan!</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 text-amber-600" />
                  <span className="text-[11px]">Live Motion</span>
                  <ChevronUp className="w-3.5 h-3.5 text-amber-700 ml-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Modal for Mobile Live Motion Format Selection */}
      {isMotionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsMotionModalOpen(false)}
          />
          <div className="relative w-full max-w-sm mx-auto bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 space-y-3 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
              <div>
                <h3 className="text-sm font-bold text-studio-graphite">Pilih Format Live Motion</h3>
                <p className="text-[11px] text-stone-600">Pilih format sesuai kebutuhan sosial media Anda</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMotionModalOpen(false)}
                className="p-1 rounded-full text-stone-600 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {/* Option 1: MP4 */}
              <button
                type="button"
                onClick={() => {
                  setIsMotionModalOpen(false);
                  handleDownloadMotion('mp4');
                }}
                className="w-full text-left p-3 rounded-2xl border border-stone-200/90 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 transition-all flex items-center justify-between active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <span>Video MP4</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Instagram & TikTok
                      </span>
                    </div>
                    <p className="text-[10.5px] text-stone-600 mt-0.5">
                      HD 24 FPS mulus, pas untuk Story & Reels
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-700" />
              </button>

              {/* Option 2: GIF */}
              <button
                type="button"
                onClick={() => {
                  setIsMotionModalOpen(false);
                  handleDownloadMotion('gif');
                }}
                className="w-full text-left p-3 rounded-2xl border border-stone-200/90 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 transition-all flex items-center justify-between active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <span>Animasi GIF</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        WhatsApp & X
                      </span>
                    </div>
                    <p className="text-[10.5px] text-stone-600 mt-0.5">
                      Looping terus-menerus, pas untuk chat WA
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-700" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsMotionModalOpen(false)}
              className="w-full py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
