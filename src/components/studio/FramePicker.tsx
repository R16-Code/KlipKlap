import React from 'react';
import { Lock, Crown, Check } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { FRAME_OPTIONS } from '../../utils/constants';

export const FramePicker: React.FC = () => {
  const { selectedFrame, setSelectedFrame } = useBoothStore();
  const { isPro, openProModal } = useAuthStore();

  const handleFrameClick = (frameId: string, frameName: string, frameIsPro?: boolean) => {
    if (frameIsPro && !isPro) {
      openProModal(`${frameName} Frame`);
      return;
    }
    setSelectedFrame(frameId);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-studio-graphite uppercase tracking-wider">
          Frame Color
        </label>
        <span className="text-[11px] text-stone-600 font-medium">
          {FRAME_OPTIONS.find((f) => f.id === selectedFrame)?.name}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {FRAME_OPTIONS.map((frame) => {
          const isSelected = selectedFrame === frame.id;
          const isLocked = frame.isPro && !isPro;

          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => handleFrameClick(frame.id, frame.name, frame.isPro)}
              className={`relative p-2.5 rounded-2xl border transition-all flex flex-col items-center text-center group ${
                isSelected
                  ? 'border-studio-graphite bg-white ring-1 ring-studio-graphite/20 shadow-soft'
                  : 'border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-stone-300'
              }`}
            >
              {/* Color Swatch Circle */}
              <div
                className="w-8 h-8 rounded-full shadow-inner-glow mb-1.5 flex items-center justify-center relative border border-black/10"
                style={{ backgroundColor: frame.color }}
              >
                {isSelected && (
                  <Check
                    className={`w-4 h-4 ${
                      frame.id === 'matte_charcoal' || frame.id === 'sage_olive'
                        ? 'text-white'
                        : 'text-stone-900'
                    }`}
                  />
                )}
                {isLocked && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              {/* Frame Name */}
              <span className="text-[11px] font-semibold text-studio-graphite truncate w-full">
                {frame.name}
              </span>

              {/* Pro Badge */}
              {frame.isPro && (
                <span className="mt-0.5 text-[9px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded-full uppercase flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" />
                  Pro
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
