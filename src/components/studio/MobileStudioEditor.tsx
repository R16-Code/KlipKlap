import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  LayoutGrid,
  Palette,
  Sparkles,
  Type,
  ChevronDown,
  Check,
  Calendar,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  Heart,
  Video,
} from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { FRAME_OPTIONS, FILTER_OPTIONS, LAYOUT_CONFIGS } from '../../utils/constants';
import { downloadHighResPhotostrip, downloadLiveMotionVideo } from '../../utils/canvasComposer';
import { EditorCanvas } from './EditorCanvas';
import { SlotCalibrator } from './SlotCalibrator';
import confetti from 'canvas-confetti';
import type { LayoutType, FrameCategory, FilterType } from '../../types';

export const MobileStudioEditor: React.FC = () => {
  const {
    capturedPhotos,
    layout,
    setLayout,
    selectedFrame,
    setSelectedFrame,
    selectedFilter,
    setSelectedFilter,
    studioSettings,
    updateStudioSettings,
    setCurrentStep,
    resetSession,
    setPreviewMode,
  } = useBoothStore();

  const [activeTab, setActiveTab] = useState<'layouts' | 'frames' | 'filters' | 'caption' | null>(null);
  const [frameCategory, setFrameCategory] = useState<FrameCategory | 'all'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [videoSuccess, setVideoSuccess] = useState(false);

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

  const handleDownloadMotion = async () => {
    if (isExporting || isExportingVideo || capturedPhotos.length === 0) return;

    if (isIncomplete) {
      const proceed = window.confirm(
        `Foto belum lengkap: Baru ada ${capturedPhotos.length} dari ${requiredPhotos} slot foto.\n\nTetap ekspor video Live Motion sekarang?`
      );
      if (!proceed) return;
    }

    try {
      setIsExportingVideo(true);
      setVideoProgress(0);
      setPreviewMode('motion');

      await downloadLiveMotionVideo(
        {
          photos: capturedPhotos,
          layout,
          frameId: selectedFrame,
          filter: selectedFilter,
          settings: studioSettings,
        },
        (progress) => setVideoProgress(progress)
      );

      setVideoSuccess(true);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#F59E0B', '#E65D47', '#3B82F6', '#10B981'],
      });

      setTimeout(() => setVideoSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to export Live Motion video:', err);
      alert('Gagal mengekspor video Live Motion. Pastikan browser mendukung MediaRecorder.');
    } finally {
      setIsExportingVideo(false);
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
                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                  {frameCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFrameCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold whitespace-nowrap transition-all ${
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
                  {filteredFrames.map((frame) => {
                    const isSelected = selectedFrame === frame.id;
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

        {/* 4 Bottom Navigation Tabs */}
        <div className="grid grid-cols-4 border-b border-stone-200/60">
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

            {/* Button 2: Download Live Motion (MP4) */}
            <button
              type="button"
              disabled={isExporting || isExportingVideo}
              onClick={handleDownloadMotion}
              className={`flex-1 py-3 min-h-[46px] px-2 rounded-2xl text-xs font-bold tracking-tight uppercase flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98] border ${
                videoSuccess
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 border-amber-300/80'
              }`}
              title="Download video Live Motion MP4"
            >
              {isExportingVideo ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
                  <span className="text-[11px]">MP4 ({videoProgress}%)...</span>
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
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
