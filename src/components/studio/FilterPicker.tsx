import React from 'react';
import { useBoothStore } from '../../stores/useBoothStore';
import { FILTER_OPTIONS } from '../../utils/constants';
import type { FilterType } from '../../types';

export const FilterPicker: React.FC = () => {
  const { selectedFilter, setSelectedFilter } = useBoothStore();

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

      <div className="grid grid-cols-2 gap-2">
        {FILTER_OPTIONS.map((filter) => {
          const isSelected = selectedFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setSelectedFilter(filter.id as FilterType)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-studio-graphite bg-white ring-1 ring-studio-graphite/20 shadow-soft'
                  : 'border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-stone-300'
              }`}
            >
              {/* Filter Tone Preview Swatch */}
              <div className="h-6 rounded-lg mb-2 overflow-hidden border border-black/5 relative">
                {filter.id === 'bw' ? (
                  <div className="w-full h-full bg-gradient-to-r from-neutral-900 via-neutral-400 to-neutral-100" />
                ) : filter.id === 'sepia' ? (
                  <div className="w-full h-full bg-gradient-to-r from-[#4A3222] via-[#C99C6A] to-[#FCEFDA]" />
                ) : filter.id === 'grain' ? (
                  <div className="w-full h-full bg-gradient-to-r from-stone-800 via-stone-500 to-stone-200 opacity-90 vintage-grain-overlay" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-rose-200 via-amber-100 to-sky-100" />
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-studio-graphite">
                    {filter.name}
                  </span>
                  <span className="text-[10px] text-stone-600 font-medium font-sans">
                    {filter.koreanName}
                  </span>
                </div>
                <p className="text-[10px] text-stone-600 mt-0.5 leading-snug line-clamp-1">
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
