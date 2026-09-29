import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { FRAME_OPTIONS } from '../../utils/constants';
import { SlotCalibrator } from './SlotCalibrator';
import type { FrameCategory } from '../../types';

export const FramePicker: React.FC = () => {
  const { selectedFrame, setSelectedFrame } = useBoothStore();
  const [activeCategory, setActiveCategory] = useState<FrameCategory | 'all'>('all');

  const categories: { id: FrameCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'solid', label: 'Solid' },
    { id: 'retro', label: 'Retro 🎞️' },
    { id: 'cute', label: 'Cute 🍒' },
    { id: 'y2k', label: 'Y2K 👾' },
  ];

  const filteredFrames =
    activeCategory === 'all'
      ? FRAME_OPTIONS
      : FRAME_OPTIONS.filter((f) => f.category === activeCategory);

  const currentFrameObj = FRAME_OPTIONS.find((f) => f.id === selectedFrame);

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-studio-graphite uppercase tracking-wider">
          Frame Design
        </label>
        <span className="text-[11px] text-stone-600 font-medium flex items-center gap-1 max-w-[130px] truncate">
          {currentFrameObj?.emoji && <span>{currentFrameObj.emoji}</span>}
          <span className="truncate">{currentFrameObj?.name}</span>
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 p-1 bg-stone-100/80 rounded-xl overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`py-1 px-2 rounded-lg text-[10px] font-semibold transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-white text-studio-graphite shadow-soft-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Frame Cards Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
        {filteredFrames.map((frame) => {
          const isSelected = selectedFrame === frame.id;

          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => setSelectedFrame(frame.id)}
              className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-studio-graphite bg-white ring-1 ring-studio-graphite/20 shadow-soft'
                  : 'border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-stone-300'
              }`}
            >
              {/* Header inside button: Color swatch / Thumbnail + Emoji */}
              <div className="flex items-center justify-between w-full mb-1.5">
                <div
                  className="w-6 h-6 rounded-full shadow-inner border border-black/10 flex items-center justify-center relative"
                  style={{ backgroundColor: frame.color }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        [
                          'matte_charcoal',
                          'midnight_navy',
                          'wine_bordeaux',
                          'retro_film',
                          'retro_cassette',
                          'retro_vhs',
                          'cocoa_muted',
                          'y2k_holo',
                          'y2k_pixel',
                          'y2k_cyberpunk',
                          'y2k_glitter_star',
                        ].includes(frame.id)
                          ? 'text-white'
                          : 'text-stone-900'
                      }`}
                    />
                  )}
                </div>

                {frame.emoji && <span className="text-xs">{frame.emoji}</span>}
              </div>

              {/* Title & Tagline */}
              <div>
                <p className="text-xs font-semibold text-studio-graphite truncate leading-tight">
                  {frame.name}
                </p>
                {frame.tagline && (
                  <p className="text-[9.5px] text-stone-600 truncate mt-0.5 leading-snug">
                    {frame.tagline}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Real-Time Photo Slot Position Calibrator (Kept as requested) */}
      <SlotCalibrator />
    </div>
  );
};
