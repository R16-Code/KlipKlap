import React, { useState } from 'react';
import { Download, Sparkles, Check, Calendar, Type, ArrowLeft, RotateCcw } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { downloadHighResPhotostrip } from '../../utils/canvasComposer';
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
  } = useBoothStore();

  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    if (isExporting || capturedPhotos.length === 0) return;

    try {
      setIsExporting(true);
      await downloadHighResPhotostrip({
        photos: capturedPhotos,
        layout,
        frameId: selectedFrame,
        filter: selectedFilter,
        settings: studioSettings,
        scale: 2.5, // 300 DPI high-res scale
      });

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

          <div className="space-y-2">
            <div>
              <span className="text-[10px] font-semibold text-stone-600 uppercase">
                Studio Title
              </span>
              <input
                type="text"
                value={studioSettings.title}
                onChange={(e) => updateStudioSettings({ title: e.target.value.toUpperCase() })}
                placeholder="KLIPKLAP STUDIO"
                maxLength={24}
                className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-studio-graphite focus:outline-none focus:ring-1 focus:ring-studio-graphite tracking-wider"
              />
            </div>

            <div>
              <span className="text-[10px] font-semibold text-stone-600 uppercase">
                Subtitle Archive
              </span>
              <input
                type="text"
                value={studioSettings.subtitle}
                onChange={(e) => updateStudioSettings({ subtitle: e.target.value.toUpperCase() })}
                placeholder="SELF PHOTO ARCHIVE"
                maxLength={28}
                className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-studio-graphite tracking-wide"
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
        <div className="p-3.5 rounded-2xl bg-studio-oat/60 border border-stone-200/60 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700">
            <span>Format</span>
            <span className="font-mono text-stone-500">Lossless PNG</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700">
            <span>Resolution</span>
            <span className="font-mono text-stone-500">300 DPI Print Ready</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700">
            <span>Paper Tone</span>
            <span className="text-stone-500 capitalize">{selectedFrame.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-stone-200/60 space-y-2 mt-4">
        {/* Download Button */}
        <button
          type="button"
          disabled={isExporting}
          onClick={handleDownload}
          className={`w-full py-3.5 px-4 rounded-2xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md ${
            downloadSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-studio-charcoal text-white hover:bg-black active:scale-[0.98]'
          }`}
        >
          {isExporting ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              <span>Generating Print File...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Downloaded to Laptop!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download High-Res PNG</span>
            </>
          )}
        </button>

        {/* Secondary Navigation */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setCurrentStep('booth')}
            className="py-2.5 px-3 rounded-xl border border-stone-200 text-stone-600 hover:text-studio-graphite hover:bg-stone-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Booth</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Start a fresh photobooth session?')) {
                resetSession();
              }
            }}
            className="py-2.5 px-3 rounded-xl border border-stone-200 text-stone-600 hover:text-studio-graphite hover:bg-stone-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
