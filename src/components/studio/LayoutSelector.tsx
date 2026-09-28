import React from 'react';
import { useBoothStore } from '../../stores/useBoothStore';
import { LAYOUT_CONFIGS } from '../../utils/constants';
import type { LayoutType } from '../../types';

export const LayoutSelector: React.FC = () => {
  const { layout, setLayout } = useBoothStore();

  const layoutKeys: LayoutType[] = [
    'strip_1x4',
    'strip_1x3',
    'grid_2x2',
    'grid_3x3',
    'grid_2x3',
    'strip_1x2',
    'polaroid_1x1',
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-studio-graphite uppercase tracking-wider">
          Studio Layout
        </label>
        <span className="text-[11px] text-stone-600 font-medium">
          {LAYOUT_CONFIGS[layout].name}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
        {layoutKeys.map((key) => {
          const config = LAYOUT_CONFIGS[key];
          const isSelected = layout === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setLayout(key)}
              className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
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
                <p className="text-[10px] text-stone-600 mt-0.5 font-medium">
                  {config.photoCount} cuts
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
