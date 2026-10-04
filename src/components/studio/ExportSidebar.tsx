import React, { useState } from 'react';
import { Download, Sparkles, Check, Calendar, Type, ArrowLeft, ShieldCheck, Trash2, AlertTriangle, Video } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { downloadHighResPhotostrip, downloadLiveMotionVideo } from '../../utils/canvasComposer';
import { LAYOUT_CONFIGS } from '../../utils/constants';
import confetti from 'canvas-confetti';

export const ExportSidebar: React.FC = () => {
  const {
    capturedPhotos,
    layout,
    selectedFrame,
    selectedFilter,
    studioSettings,
    updateStudioSettings,
    setCurrentStep,
    resetSession,
    setPreviewMode,
  } = useBoothStore();

  const [isExporting, setIsExporting] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [videoSuccess, setVideoSuccess] = useState(false);

  const layoutConfig = LAYOUT_CONFIGS[layout];
  const requiredPhotos = layoutConfig.photoCount;
  const isIncomplete = capturedPhotos.length < requiredPhotos;

  const handleDownload = async () => {
    if (isExporting || isExportingVideo || capturedPhotos.length === 0) return;

    if (isIncomplete) {
      const proceed = window.confirm(
        `Foto belum lengkap: Baru ada ${capturedPhotos.length} dari ${requiredPhotos} slot foto (masih kurang ${requiredPhotos - capturedPhotos.length} foto).\n\nTetap download sekarang dengan slot kosong?`
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
          scale: 2.5, // 300 DPI high-res scale
        },
        'png'
      );

      setDownloadSuccess(true);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#E65D47', '#C5A880', '#262626', '#F5F3ED'],
      });

      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Failed to export photostrip:', err);
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
        particleCount: 100,
        spread: 90,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#E65D47', '#3B82F6', '#10B981'],
      });

      setTimeout(() => {
        setVideoSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Failed to export Live Motion video:', err);
      alert('Gagal mengekspor video Live Motion. Pastikan browser mendukung MediaRecorder.');
    } finally {
      setIsExportingVideo(false);
    }
  };

  return (
    <aside aria-label="Export and Stamp Settings" className="w-full h-full flex flex-col justify-between bg-white/75 backdrop-blur-md rounded-3xl p-4 border border-black/[0.06] shadow-soft overflow-y-auto no-scrollbar">
      <div className="space-y-4">
        {/* Header */}
        <div className="pb-2 border-b border-stone-200/60 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold tracking-wider text-studio-graphite uppercase font-sans">
              Print & Stamp
            </h2>
            <p className="text-[11px] text-stone-600 font-medium">
              300 DPI High-DPI Output
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
            Ready
          </span>
        </div>

        {/* Date & Title Customization Form */}
        <div className="space-y-3.5">
          <label className="text-xs font-bold text-studio-graphite uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-stone-600" />
            <span>Strip Stamp Text</span>
          </label>

          <div className="space-y-2.5">
            {/* Watermark Studio Brand Title (Default & Non-Editable) */}
            <div className="p-2.5 rounded-xl bg-stone-50/80 border border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="text-[9.5px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Studio Title (Watermark)
                </span>
                <span className="text-xs font-bold text-studio-graphite tracking-wider font-sans">
                  KLIPKLAP STUDIO
                </span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-600 font-semibold uppercase tracking-wider">
                Default
              </span>
            </div>

            {/* Subtitle Archive (Editable) */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-stone-600 uppercase">
                  Subtitle Archive
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  {studioSettings.subtitle.length}/28
                </span>
              </div>
              <input
                type="text"
                value={studioSettings.subtitle}
                onChange={(e) => updateStudioSettings({ subtitle: e.target.value.toUpperCase() })}
                placeholder="SELF PHOTO ARCHIVE"
                maxLength={28}
                className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-studio-graphite tracking-wide font-medium"
              />
            </div>

            {/* Toggle Date Stamp */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => updateStudioSettings({ showDate: !studioSettings.showDate })}
                className="w-full flex items-center justify-between p-2.5 bg-stone-50/70 hover:bg-stone-50 rounded-xl border border-stone-200/70 text-xs font-medium text-stone-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-stone-600" />
                  <span>Include Date Stamp</span>
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
            </div>
          </div>
        </div>

        {/* Paper Quality Specs Info Card */}
        <div className="p-3 rounded-2xl bg-studio-oat/60 border border-stone-200/60 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700">
            <span>Format</span>
            <span className="font-mono text-stone-500">Lossless 300 DPI</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700">
            <span>Border Line</span>
            <span className="text-emerald-700 font-medium">Included (Always Visible)</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700">
            <span>Paper Tone</span>
            <span className="text-stone-500 capitalize">{selectedFrame.replace('_', ' ')}</span>
          </div>
        </div>

        {/* 100% Client-Side Privacy Guarantee */}
        <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-[10.5px] leading-snug">
            <span className="font-bold text-emerald-900 block">
              Privasi & Keamanan 100%
            </span>
            <p className="text-emerald-800/90 text-[10px] mt-0.5 leading-relaxed">
              Foto diproses lokal di browser laptop. KlipKlap <strong>tidak pernah mengunggah atau menyimpan</strong> foto Anda ke server/database mana pun.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-stone-200/60 space-y-2 mt-3">
        {/* Warning if photos incomplete */}
        {isIncomplete && (
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Slot foto belum lengkap ({capturedPhotos.length}/{requiredPhotos})</span>
          </div>
        )}

        {/* Action Button 1: Download Photo (PNG) */}
        <button
          type="button"
          disabled={isExporting || isExportingVideo}
          onClick={handleDownload}
          className={`w-full py-3 px-4 rounded-2xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
            downloadSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-studio-charcoal text-white hover:bg-black'
          }`}
        >
          {isExporting ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              <span>Generating PNG (300 DPI)...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Foto PNG Tersimpan!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Foto (PNG)</span>
            </>
          )}
        </button>

        {/* Action Button 2: Download Live Motion (MP4) */}
        <button
          type="button"
          disabled={isExporting || isExportingVideo}
          onClick={handleDownloadMotion}
          className={`w-full py-3 px-4 rounded-2xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] border ${
            videoSuccess
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border-amber-400/50'
          }`}
          title="Download photostrip bergerak berformat video MP4"
        >
          {isExportingVideo ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
              <span>Merekam Video MP4 ({videoProgress}%)...</span>
            </>
          ) : videoSuccess ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Video MP4 Tersimpan!</span>
            </>
          ) : (
            <>
              <Video className="w-4 h-4 text-amber-600" />
              <span>Download Live Motion (MP4)</span>
            </>
          )}
        </button>

        {/* Clear Photos / End Session Button */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Hapus seluruh foto sesi ini dari memori browser?')) {
              resetSession();
            }
          }}
          className="w-full py-2 px-3 rounded-xl border border-rose-200/80 bg-rose-50/50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          title="Hapus foto dari memori browser demi privasi Anda"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
          <span>Selesai & Hapus Semua Foto</span>
        </button>

        {/* Secondary Navigation: Back to Booth */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setCurrentStep('booth')}
            className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-stone-600 hover:text-studio-graphite hover:bg-stone-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-soft-sm active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Booth</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
