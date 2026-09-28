import React from 'react';
import { X, Crown, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import confetti from 'canvas-confetti';

export const ProModal: React.FC = () => {
  const { isProModalOpen, closeProModal, proFeatureAttempted, setProStatus } = useAuthStore();

  if (!isProModalOpen) return null;

  const handleUpgradeMock = () => {
    setProStatus(true);
    closeProModal();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E65D47', '#C5A880', '#262626', '#F5F3ED'],
    });
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="pro-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-popIn"
    >
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200/80 relative"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeProModal}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge & Header */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-inner">
            <Crown className="w-7 h-7" />
          </div>

          <span className="text-[11px] font-bold tracking-widest text-amber-700 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 mb-2">
            PRO STUDIO EXCLUSIVE
          </span>

          <h3 id="pro-modal-title" className="text-xl font-bold text-studio-graphite font-sans">
            Unlock {proFeatureAttempted || 'Premium Frame'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs">
            Experience our Korean atelier textures, unlimited high-DPI renders, and signature darkroom frames.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="my-6 space-y-2.5 bg-studio-milk p-4 rounded-2xl border border-stone-100">
          <div className="flex items-center gap-3 text-xs text-stone-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sage Atelier & Chrome Gloss editorial frames</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ultra 300 DPI lossless PNG downloads</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Custom bottom stamp typography & date stamps</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleUpgradeMock}
            className="w-full py-3 px-4 rounded-2xl bg-studio-charcoal text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Activate Mock Pro Membership (Instant)</span>
          </button>

          <button
            type="button"
            onClick={closeProModal}
            className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 font-medium transition-colors"
          >
            Continue with Free Plan
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[10px] text-stone-600">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
          <span>Demo MVP environment • No payment card needed</span>
        </div>
      </div>
    </div>
  );
};
