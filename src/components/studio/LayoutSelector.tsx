import React from 'react';
import { Camera, RotateCcw, AlertCircle } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { LAYOUT_CONFIGS, getFittingLayout } from '../../utils/constants';
import type { LayoutType } from '../../types';

export const LayoutSelector: React.FC = () => {
  const { layout, setLayout, capturedPhotos, setCurrentStep } = useBoothStore();

  const layoutKeys: LayoutType[] = [
    'strip_1x4',
    'strip_1x3',
    'grid_2x2',
    'grid_3x3',
    'grid_2x3',
    'strip_1x2',
    'polaroid_1x1',
  ];

  const currentConfig = LAYOUT_CONFIGS[layout];
  const missingCount = currentConfig.photoCount - capturedPhotos.length;
  const isCurrentIncomplete = missingCount > 0;
  const fittingLayout = getFittingLayout(capturedPhotos.length);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-studio-graphite uppercase tracking-wider">
          Studio Layout
        </label>
        <span className="text-[11px] text-stone-600 font-medium">
          {currentConfig.name}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
        {layoutKeys.map((key) => {
          const config = LAYOUT_CONFIGS[key];
          const isSelected = layout === key;
          const diff = config.photoCount - capturedPhotos.length;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setLayout(key)}
              className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between relative ${
                isSelected
                  ? 'border-studio-graphite bg-white shadow-soft ring-1 ring-studio-graphite/20'
                  : 'border-stone-200/80 bg-stone-50/60 hover:bg-white hover:border-stone-300'
              }`}
            >
              {/* Miniature Layout Wireframe Icon */}
              <div className="h-9 mb-1.5 flex items-center justify-center">
                {key === 'grid_3x3' ? (
                  <div className="w-8 h-8 grid grid-cols-3 gap-0.5 p-1 bg-stone-200/70 rounded-md">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="bg-stone-400 rounded-[1.5px]" />
                    ))}
                  </div>
                ) : key === 'grid_2x3' ? (
                  <div className="w-7 h-9 grid grid-cols-2 gap-0.5 p-1 bg-stone-200/70 rounded-md">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-stone-400 rounded-[1.5px]" />
                    ))}
                  </div>
                ) : key === 'grid_2x2' ? (
                  <div className="w-8 h-8 grid grid-cols-2 gap-0.5 p-1 bg-stone-200/70 rounded-md">
                    <div className="bg-stone-400 rounded-[2px]" />
                    <div className="bg-stone-400 rounded-[2px]" />
                    <div className="bg-stone-400 rounded-[2px]" />
                    <div className="bg-stone-400 rounded-[2px]" />
                  </div>
                ) : key === 'strip_1x3' ? (
                  <div className="w-5 h-9 flex flex-col gap-0.5 p-0.5 bg-stone-200/70 rounded-md">
                    <div className="flex-1 bg-stone-400 rounded-[2px]" />
                    <div className="flex-1 bg-stone-400 rounded-[2px]" />
                    <div className="flex-1 bg-stone-400 rounded-[2px]" />
                  </div>
                ) : key === 'strip_1x2' ? (
                  <div className="w-5 h-8 flex flex-col gap-0.5 p-0.5 bg-stone-200/70 rounded-md">
                    <div className="flex-1 bg-stone-400 rounded-[2px]" />
                    <div className="flex-1 bg-stone-400 rounded-[2px]" />
                  </div>
                ) : key === 'polaroid_1x1' ? (
                  <div className="w-7 h-9 flex flex-col p-1 pb-2.5 bg-stone-200/70 rounded-md">
                    <div className="flex-1 bg-stone-400 rounded-[2px]" />
                  </div>
                ) : (
                  /* 1x4 */
                  <div className="w-5 h-9 flex flex-col gap-0.5 p-0.5 bg-stone-200/70 rounded-md">
                    <div className="flex-1 bg-stone-400 rounded-[2px]" />
                    <div className="flex-1 bg-stone-400 rounded-[2px]" />
                    <div className="flex-1 bg-stone-400 rounded-[2px]" />
                    <div className="flex-1 bg-stone-400 rounded-[2px]" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-studio-graphite leading-tight truncate">
                  {config.name}
                </p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[10px] text-stone-600 font-medium">
                    {config.photoCount} cuts
                  </p>
                  {diff > 0 && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-medium">
                      +{diff} foto
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Alert if Selected Layout has Missing Photos */}
      {isCurrentIncomplete && (
        <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200/90 space-y-2 mt-2 shadow-soft-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-snug">
              <span className="font-bold text-amber-950 block">
                Perlu {missingCount} Foto Tambahan
              </span>
              <p className="text-amber-800 text-[10px] mt-0.5 leading-relaxed">
                Anda baru mengambil {capturedPhotos.length} foto, sedangkan layout ini butuh {currentConfig.photoCount} foto.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            {/* Action 1: Add photos in Live Capture */}
            <button
              type="button"
              onClick={() => setCurrentStep('booth')}
              className="w-full py-1.5 px-2.5 rounded-xl bg-studio-charcoal text-white hover:bg-black text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>Ambil {missingCount} Foto Lagi (Live Capture)</span>
            </button>

            {/* Action 2: Switch back to matching layout */}
            {fittingLayout && fittingLayout !== layout && (
              <button
                type="button"
                onClick={() => setLayout(fittingLayout)}
                className="w-full py-1.5 px-2.5 rounded-xl bg-white border border-amber-300/90 text-amber-900 hover:bg-amber-100/70 text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-soft-sm active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Gunakan Layout {LAYOUT_CONFIGS[fittingLayout].name} ({capturedPhotos.length} Foto)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
