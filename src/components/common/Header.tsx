import React from 'react';
import { Camera, Sparkles, RotateCcw, Crown, Check } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const Header: React.FC = () => {
  const { currentStep, setCurrentStep, resetSession, capturedPhotos } = useBoothStore();
  const { isPro, toggleProStatus, openProModal } = useAuthStore();

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

      {/* Step Indicator */}
      <nav aria-label="Booth Workflow Steps" className="flex items-center gap-2 bg-studio-oat/80 px-2 py-1.5 rounded-2xl border border-black/[0.04] shadow-inner-glow">
        <button
          type="button"
          onClick={() => handleStepChange('booth')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            currentStep === 'booth'
              ? 'bg-white text-studio-graphite shadow-soft-sm'
              : 'text-stone-600 hover:text-studio-graphite hover:bg-white/50'
          }`}
        >
          <span className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center bg-stone-200/80 text-stone-700">
            1
          </span>
          Live Capture
        </button>

        <div className="w-3 h-[1px] bg-stone-300" />

        <button
          type="button"
          onClick={() => handleStepChange('studio')}
          disabled={capturedPhotos.length === 0}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            currentStep === 'studio'
              ? 'bg-white text-studio-graphite shadow-soft-sm'
              : capturedPhotos.length > 0
              ? 'text-stone-600 hover:text-studio-graphite hover:bg-white/50 cursor-pointer'
              : 'text-stone-600/50 cursor-not-allowed opacity-60'
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

      {/* Pro Switch & Session Controls */}
      <div className="flex items-center gap-3">
        {/* Mock Pro Tier Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleProStatus}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              isPro
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 shadow-soft-sm'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
            title="Toggle mock Pro membership to test unlocked features"
          >
            {isPro ? (
              <>
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>Pro Member</span>
                <Check className="w-3 h-3 ml-0.5" />
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Free Plan</span>
                <span className="text-[10px] px-1 py-0.2 bg-stone-100 rounded text-stone-500">
                  Mock
                </span>
              </>
            )}
          </button>

          {!isPro && (
            <button
              type="button"
              onClick={() => openProModal('Pro Studio Pass')}
              className="text-xs text-stone-500 hover:text-studio-graphite transition-colors underline underline-offset-2"
            >
              Unlock Pro
            </button>
          )}
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
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
