import React from 'react';
import { useBoothStore } from '../../stores/useBoothStore';
import { FILTER_OPTIONS } from '../../utils/constants';
import type { FilterType } from '../../types';

export const FilterPicker: React.FC = () => {
  const { selectedFilter, setSelectedFilter } = useBoothStore();

  const getFilterGradient = (id: FilterType) => {
    switch (id) {
      case 'bw':
        return 'bg-gradient-to-r from-neutral-900 via-neutral-500 to-neutral-100';
      case 'sepia':
        return 'bg-gradient-to-r from-[#4A3222] via-[#C99C6A] to-[#FCEFDA]';
      case 'grain':
        return 'bg-gradient-to-r from-stone-800 via-stone-500 to-stone-200 opacity-90 vintage-grain-overlay';
      case 'pastel':
        return 'bg-gradient-to-r from-pink-300 via-rose-200 to-purple-200';
      case 'fuji':
        return 'bg-gradient-to-r from-emerald-600 via-teal-400 to-sky-300';
      case 'cyber':
        return 'bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-600';
      case 'cinema':
        return 'bg-gradient-to-r from-[#0F303B] via-[#2A6570] to-[#E9B171]';
      case 'soft':
        return 'bg-gradient-to-r from-[#FFF5EE] via-[#FCE4D6] to-[#F8D7DA]';
      case 'normal':
      default:
        return 'bg-gradient-to-r from-rose-200 via-amber-100 to-sky-100';
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-studio-graphite uppercase tracking-wider">
          Filter Preset
        </label>
        <span className="text-[11px] text-stone-600 font-medium">
          {FILTER_OPTIONS.find((f) => f.id === selectedFilter)?.name}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
        {FILTER_OPTIONS.map((filter) => {
          const isSelected = selectedFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setSelectedFilter(filter.id)}
              className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-studio-graphite bg-white ring-1 ring-studio-graphite/20 shadow-soft'
                  : 'border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-stone-300'
              }`}
            >
              {/* Filter Tone Preview Swatch */}
              <div className={`h-6 rounded-lg mb-1.5 overflow-hidden border border-black/5 relative ${getFilterGradient(filter.id)}`} />

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-studio-graphite truncate">
                    {filter.name}
                  </span>
                  <span className="text-[9.5px] text-stone-500 font-medium font-sans shrink-0 ml-1">
                    {filter.koreanName}
                  </span>
                </div>
                <p className="text-[9.5px] text-stone-600 mt-0.5 leading-snug line-clamp-1">
                  {filter.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
