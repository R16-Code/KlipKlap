import React, { useEffect, useState } from 'react';
import {
  Camera,
  Timer,
  LayoutGrid,
  Sparkles,
  Palette,
  Smile,
  Download,
  ShieldCheck,
  X,
  ArrowRight,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';

interface GuideStep {
  number: string;
  tag: string;
  title: string;
  description: string;
  tip: string;
  icon: React.ReactNode;
  accentBg: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    number: '01',
    tag: 'Kamera',
    title: 'Izinkan Akses Kamera',
    description:
      'Izinkan kamera saat diminta browser, atau klik Use Demo untuk mencoba tanpa kamera.',
    tip: 'Bisa ganti kamera depan/belakang di pojok kanan atas kamera.',
    icon: <Camera className="w-5 h-5 sm:w-7 sm:h-7 text-studio-graphite" />,
    accentBg: 'bg-studio-oat border-stone-200',
  },
  {
    number: '02',
    tag: 'Persiapan',
    title: 'Atur Timer & Mirror',
    description:
      'Pilih durasi hitung mundur (3s, 5s, atau 10s) dan aktifkan Mirror sesuai selera.',
    tip: 'Mirror membantu hasil foto depan sama persis seperti di layar.',
    icon: <Timer className="w-5 h-5 sm:w-7 sm:h-7 text-amber-700" />,
    accentBg: 'bg-amber-50 border-amber-200/80',
  },
  {
    number: '03',
    tag: 'Layout',
    title: 'Pilih Layout Strip Foto',
    description:
      'Tentukan jumlah kotak foto favoritmu, mulai dari 1×4, 1×3, 2×2, hingga Polaroid.',
    tip: 'Layout masih bisa diganti nanti saat berada di Studio Editor.',
    icon: <LayoutGrid className="w-5 h-5 sm:w-7 sm:h-7 text-blue-700" />,
    accentBg: 'bg-blue-50 border-blue-200/80',
  },
  {
    number: '04',
    tag: 'Pemotretan',
    title: 'Pose & Foto Beruntun',
    description:
      'Tekan tombol Shutter (atau Spasi) untuk mulai foto beruntun beserta klip Live Motion.',
    tip: 'Kurang puas? Klik Retake untuk foto ulang slot tertentu.',
    icon: <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-purple-700" />,
    accentBg: 'bg-purple-50 border-purple-200/80',
  },
  {
    number: '05',
    tag: 'Frame & BG',
    title: 'Atur Frame & Background',
    description:
      'Pilih warna/motif frame atau upload background foto sendiri yang bisa digeser & di-zoom.',
    tip: 'Urutan foto juga bisa ditukar lewat panel Strip Roll.',
    icon: <Palette className="w-5 h-5 sm:w-7 sm:h-7 text-rose-700" />,
    accentBg: 'bg-studio-blushLight border-rose-200/70',
  },
  {
    number: '06',
    tag: 'Filter & Stiker',
    title: 'Pasang Filter & Stiker',
    description:
      'Pilih Filter warna lalu hias dengan stiker karakter atau upload stiker PNG transparan.',
    tip: 'Geser, putar, dan cubit ukuran stiker langsung di atas frame.',
    icon: <Smile className="w-5 h-5 sm:w-7 sm:h-7 text-pink-700" />,
    accentBg: 'bg-pink-50 border-pink-200/80',
  },
  {
    number: '07',
    tag: 'Simpan',
    title: 'Unduh Hasil Gratis',
    description:
      'Simpan fotostrip dalam format PNG (High-Res), GIF, atau MP4 secara gratis.',
    tip: '100% privat — semua diproses di browser tanpa dikirim ke server.',
    icon: <Download className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-700" />,
    accentBg: 'bg-emerald-50 border-emerald-200/80',
  },
];

export const WelcomeGuideModal: React.FC = () => {
  const { isGuideOpen, closeGuide } = useBoothStore();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Reset to Step 1 every time guide is opened
  useEffect(() => {
    if (isGuideOpen) {
      setCurrentStepIdx(0);
    }
  }, [isGuideOpen]);

  // Keyboard navigation (Escape to close, ArrowLeft/ArrowRight to step)
  useEffect(() => {
    if (!isGuideOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeGuide(dontShowAgain);
      } else if (e.key === 'ArrowRight') {
        setCurrentStepIdx((prev) => Math.min(GUIDE_STEPS.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStepIdx((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGuideOpen, dontShowAgain, closeGuide]);

  if (!isGuideOpen) return null;

  const step = GUIDE_STEPS[currentStepIdx];
  const isFirstStep = currentStepIdx === 0;
  const isLastStep = currentStepIdx === GUIDE_STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/55 backdrop-blur-sm flex items-center justify-center p-5 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-guide-title"
      onClick={() => closeGuide(dontShowAgain)}
    >
      <div
        className="w-full max-w-[328px] sm:max-w-md max-h-[85dvh] sm:max-h-[90dvh] bg-studio-milk border border-black/[0.08] rounded-2xl sm:rounded-3xl shadow-soft-lg flex flex-col overflow-hidden animate-popIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="shrink-0 px-4 pt-3 pb-2.5 sm:px-5 sm:pt-4 sm:pb-3 bg-white border-b border-black/[0.06] flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-studio-oat border border-stone-200 text-[9.5px] sm:text-[10px] font-bold tracking-widest text-stone-700 uppercase">
            <BookOpen className="w-3 h-3 text-studio-accent" />
            <span>Panduan KlipKlap • {step.number}/{String(GUIDE_STEPS.length).padStart(2, '0')}</span>
          </div>

          <button
            type="button"
            onClick={() => closeGuide(dontShowAgain)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-studio-graphite flex items-center justify-center transition-colors shrink-0 active:scale-95"
            aria-label="Tutup panduan"
            title="Tutup panduan"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Clickable Step Number Pills */}
        <div className="shrink-0 px-4 pt-2.5 sm:px-5 sm:pt-3 flex items-center gap-1 sm:gap-1.5">
          {GUIDE_STEPS.map((s, idx) => {
            const isActive = idx === currentStepIdx;
            const isCompleted = idx < currentStepIdx;
            return (
              <button
                key={s.number}
                type="button"
                onClick={() => setCurrentStepIdx(idx)}
                className={`flex-1 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-studio-charcoal scale-y-110'
                    : isCompleted
                    ? 'bg-stone-400 hover:bg-stone-500'
                    : 'bg-stone-200 hover:bg-stone-300'
                }`}
                aria-label={`Langkah ${idx + 1}: ${s.title}`}
                title={`${s.number}. ${s.title}`}
              />
            );
          })}
        </div>

        {/* Focused Single-Step Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3.5 sm:px-5 sm:py-5 flex flex-col items-center text-center justify-center space-y-2.5 sm:space-y-4">
          {/* Tactile Icon */}
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border flex items-center justify-center shadow-soft-sm transition-all duration-200 ${step.accentBg}`}
          >
            {step.icon}
          </div>

          {/* Step Tag & Title */}
          <div className="space-y-1 sm:space-y-1.5 max-w-sm">
            <span className="inline-block text-[9.5px] sm:text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Langkah {step.number} — {step.tag}
            </span>
            <h2
              id="welcome-guide-title"
              className="text-[15px] sm:text-lg font-bold tracking-tight text-studio-graphite font-sans"
            >
              {step.title}
            </h2>
            <p className="text-[11.5px] sm:text-[13px] text-stone-600 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Quick Tip Box */}
          <div className="w-full p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border border-black/[0.06] shadow-soft-sm flex items-center justify-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-[11px] text-stone-600">
            {isLastStep ? (
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            <span>{step.tip}</span>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="shrink-0 px-4 py-3 sm:px-5 sm:py-3.5 bg-white border-t border-black/[0.06] space-y-2 sm:space-y-3">
          {/* Navigation Row */}
          <div className="flex items-center justify-between gap-2">
            {isFirstStep ? (
              <button
                type="button"
                onClick={() => closeGuide(dontShowAgain)}
                className="px-3 sm:px-3.5 py-2 sm:py-2.5 min-h-[36px] sm:min-h-[40px] rounded-xl text-xs font-semibold text-stone-500 hover:text-studio-graphite hover:bg-stone-100 transition-colors"
              >
                Lewati
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
                className="px-3 sm:px-3.5 py-2 sm:py-2.5 min-h-[36px] sm:min-h-[40px] rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
            )}

            {isLastStep ? (
              <button
                type="button"
                onClick={() => closeGuide(dontShowAgain)}
                className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 sm:py-2.5 min-h-[36px] sm:min-h-[40px] rounded-xl bg-studio-charcoal hover:bg-black text-white text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-soft active:scale-95 transition-all"
              >
                <span>Mulai Foto Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStepIdx((prev) => Math.min(GUIDE_STEPS.length - 1, prev + 1))}
                className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 sm:py-2.5 min-h-[36px] sm:min-h-[40px] rounded-xl bg-studio-charcoal hover:bg-black text-white text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-soft active:scale-95 transition-all"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Persistence Checkbox */}
          <div className="flex items-center justify-center pt-1.5 sm:pt-1 border-t border-stone-100">
            <label className="flex items-center gap-2 text-[10.5px] sm:text-[11px] text-stone-500 hover:text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-stone-300 text-studio-charcoal focus:ring-studio-charcoal accent-studio-charcoal cursor-pointer"
              />
              <span>Jangan tampilkan lagi saat membuka web</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
