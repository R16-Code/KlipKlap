import React from 'react';
import { Camera, RotateCcw, Heart } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';

export const Header: React.FC = () => {
  const { currentStep, setCurrentStep, resetSession, capturedPhotos } = useBoothStore();

  const handleStepChange = (targetStep: 'booth' | 'studio') => {
    if (targetStep === 'studio' && capturedPhotos.length === 0) {
      return;
    }
    setCurrentStep(targetStep);
  };

  return (
    <header className="h-16 px-6 border-b border-black/[0.06] bg-studio-milk/90 backdrop-blur-md flex items-center justify-between shrink-0 select-none z-30">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-studio-charcoal text-studio-milk flex items-center justify-center shadow-soft-sm">
          <Camera className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-lg text-studio-graphite font-sans">
              KLIPKLAP
            </span>
            <span className="text-[10px] tracking-widest px-1.5 py-0.5 rounded bg-studio-sand text-stone-600 font-medium uppercase">
              STUDIO
            </span>
          </div>
          <p className="text-[11px] text-stone-600 font-medium tracking-wide">
            Self-Photo Archive
          </p>
        </div>
      </div>

      {/* Workflow Navigation Pills */}
      <nav aria-label="Booth Workflow Steps" className="flex items-center bg-stone-100/80 p-1 rounded-2xl border border-black/[0.04]">
        <button
          type="button"
          onClick={() => handleStepChange('booth')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            currentStep === 'booth'
              ? 'bg-white text-studio-graphite shadow-soft-sm'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <span className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center bg-stone-200/80 text-stone-700">
            1
          </span>
          Live Capture
        </button>

        <div className="w-3 h-[1px] bg-stone-300 mx-1" />

        <button
          type="button"
          onClick={() => handleStepChange('studio')}
          disabled={capturedPhotos.length === 0}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            currentStep === 'studio'
              ? 'bg-white text-studio-graphite shadow-soft-sm'
              : capturedPhotos.length === 0
              ? 'text-stone-400 cursor-not-allowed opacity-60'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <span className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center bg-stone-200/80 text-stone-700">
            2
          </span>
          Studio Editor
          {capturedPhotos.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>
      </nav>

      {/* Free Studio Badge & Session Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 bg-white border border-stone-200 shadow-soft-sm">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>100% Free Photobooth</span>
        </div>

        <div className="w-[1px] h-5 bg-stone-200" />

        {/* Reset Session */}
        <button
          type="button"
          onClick={() => {
            if (capturedPhotos.length === 0 || window.confirm('Start a fresh photobooth session? Current photos will be cleared.')) {
              resetSession();
            }
          }}
          className="p-2 rounded-xl text-stone-500 hover:text-studio-graphite hover:bg-white border border-transparent hover:border-stone-200 transition-all"
          title="Restart Session"
          aria-label="Restart Session"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
