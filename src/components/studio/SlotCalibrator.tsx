import React, { useState } from 'react';
import { Sliders, RotateCcw, ChevronDown, ChevronUp, MoveVertical, MoveHorizontal, Maximize2, Split } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';

export const SlotCalibrator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { studioSettings, updateSlotCalibration, resetSlotCalibration } = useBoothStore();
  const cal = studioSettings.slotCalibration;

  const isCustomized =
    cal.marginTopOffset !== 0 ||
    cal.gapOffset !== 0 ||
    cal.scaleFactor !== 1 ||
    cal.marginSideOffset !== 0;

  return (
    <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 overflow-hidden transition-all">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-center justify-between text-left hover:bg-stone-100/70 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-stone-200/80 flex items-center justify-center text-studio-graphite">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-studio-graphite block leading-tight">
              Kalibrasi Posisi Foto
            </span>
            <span className="text-[10px] text-stone-500 font-medium">
              Presisi & pas-kan lubang frame
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isCustomized && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
              Adjusted
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-stone-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-500" />
          )}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-3 pt-1 border-t border-stone-200/60 space-y-3 bg-white/70">
          <p className="text-[10.5px] text-stone-600 leading-relaxed">
            Geser slider untuk memposisikan foto agar pas dengan lubang frame custom Canva / Figma.
          </p>

          {/* 1. Margin Atas (Y Offset) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                <MoveVertical className="w-3 h-3 text-stone-500" />
                <span>Posisi Vertikal (Atas/Bawah)</span>
              </span>
              <span className="font-mono text-stone-500 text-[10px] font-medium">
                {cal.marginTopOffset > 0 ? `+${cal.marginTopOffset}` : cal.marginTopOffset} px
              </span>
            </div>
            <input
              type="range"
              min={-30}
              max={30}
              step={1}
              value={cal.marginTopOffset}
              onChange={(e) => updateSlotCalibration({ marginTopOffset: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
            />
          </div>

          {/* 2. Jarak Antar Foto (Gap) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                <Split className="w-3 h-3 text-stone-500" />
                <span>Jarak Antar Foto (Gap)</span>
              </span>
              <span className="font-mono text-stone-500 text-[10px] font-medium">
                {cal.gapOffset > 0 ? `+${cal.gapOffset}` : cal.gapOffset} px
              </span>
            </div>
            <input
              type="range"
              min={-12}
              max={24}
              step={1}
              value={cal.gapOffset}
              onChange={(e) => updateSlotCalibration({ gapOffset: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
            />
          </div>

          {/* 3. Skala Foto (Scale) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                <Maximize2 className="w-3 h-3 text-stone-500" />
                <span>Ukuran Foto (Zoom)</span>
              </span>
              <span className="font-mono text-stone-500 text-[10px] font-medium">
                {Math.round(cal.scaleFactor * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0.85}
              max={1.15}
              step={0.01}
              value={cal.scaleFactor}
              onChange={(e) => updateSlotCalibration({ scaleFactor: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
            />
          </div>

          {/* 4. Margin Samping (X Offset) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                <MoveHorizontal className="w-3 h-3 text-stone-500" />
                <span>Posisi Horizontal (Kiri/Kanan)</span>
              </span>
              <span className="font-mono text-stone-500 text-[10px] font-medium">
                {cal.marginSideOffset > 0 ? `+${cal.marginSideOffset}` : cal.marginSideOffset} px
              </span>
            </div>
            <input
              type="range"
              min={-20}
              max={20}
              step={1}
              value={cal.marginSideOffset}
              onChange={(e) => updateSlotCalibration({ marginSideOffset: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-studio-charcoal"
            />
          </div>

          {/* Reset Action */}
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={resetSlotCalibration}
              disabled={!isCustomized}
              className={`text-[11px] font-medium flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
                isCustomized
                  ? 'text-stone-700 hover:text-studio-graphite hover:bg-stone-200/70'
                  : 'text-stone-400 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Posisi Default</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
