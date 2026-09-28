import type { LayoutConfig, FrameOption, FilterOption, LayoutType } from '../types';

export const LAYOUT_CONFIGS: Record<LayoutType, LayoutConfig> = {
  strip_1x4: {
    id: 'strip_1x4',
    name: 'Classic Strip 1×4',
    subtitle: 'Signature 4-cut vertical studio strip',
    photoCount: 4,
    columns: 1,
    rows: 4,
    aspectRatio: '1:3.2',
  },
  strip_1x3: {
    id: 'strip_1x3',
    name: 'Trio Strip 1×3',
    subtitle: 'Editorial 3-cut vertical portrait',
    photoCount: 3,
    columns: 1,
    rows: 3,
    aspectRatio: '1:2.4',
  },
  grid_2x2: {
    id: 'grid_2x2',
    name: 'Studio Grid 2×2',
    subtitle: 'Modern square quad collage',
    photoCount: 4,
    columns: 2,
    rows: 2,
    aspectRatio: '1:1.15',
  },
  strip_1x2: {
    id: 'strip_1x2',
    name: 'Duo Strip 1×2',
    subtitle: 'Minimal 2-cut quick polaroid',
    photoCount: 2,
    columns: 1,
    rows: 2,
    aspectRatio: '1:1.7',
  },
};

export const FRAME_OPTIONS: FrameOption[] = [
  {
    id: 'cloud_white',
    name: 'Cloud White',
    color: '#FFFFFF',
    textColor: '#1A1A1A',
    subtextColor: '#737373',
    borderPreviewClass: 'bg-white border border-stone-200',
  },
  {
    id: 'matte_charcoal',
    name: 'Matte Charcoal',
    color: '#1F1F1F',
    textColor: '#FBFBFA',
    subtextColor: '#999999',
    borderPreviewClass: 'bg-[#1F1F1F] border border-neutral-700 text-white',
  },
  {
    id: 'oat_cream',
    name: 'Oat Cream',
    color: '#F5F3ED',
    textColor: '#2E2B27',
    subtextColor: '#7A756D',
    borderPreviewClass: 'bg-[#F5F3ED] border border-[#E3DFC] text-stone-800',
  },
  {
    id: 'blush_pink',
    name: 'Blush Pink',
    color: '#FCEEE9',
    textColor: '#422F2A',
    subtextColor: '#8C746F',
    borderPreviewClass: 'bg-[#FCEEE9] border border-[#F4DDD5] text-stone-800',
  },
  {
    id: 'sage_olive',
    name: 'Sage Atelier',
    color: '#2A362B',
    textColor: '#EFF3EE',
    subtextColor: '#9CAD9F',
    isPro: true,
    borderPreviewClass: 'bg-[#2A362B] border border-[#3E4F3F] text-emerald-50',
  },
  {
    id: 'chrome_silver',
    name: 'Chrome Gloss',
    color: '#E3E6EB',
    textColor: '#15191E',
    subtextColor: '#64748B',
    isPro: true,
    borderPreviewClass: 'bg-gradient-to-br from-slate-200 to-slate-300 border border-slate-300 text-slate-900',
  },
];

export const FILTER_OPTIONS: FilterOption[] = [
  {
    id: 'normal',
    name: 'Natural Glow',
    koreanName: '자연스러운',
    description: 'Clean balanced studio lighting with soft warmth',
  },
  {
    id: 'bw',
    name: 'Noir Editorial',
    koreanName: '흑백 필름',
    description: 'Timeless high-contrast black & white aesthetic',
  },
  {
    id: 'sepia',
    name: 'Tokyo Warmth',
    koreanName: '빈티지 웜',
    description: 'Nostalgic golden-hour tones with gentle warmth',
  },
  {
    id: 'grain',
    name: 'Silver Grain',
    koreanName: '필름 그레인',
    description: 'Analog 35mm film texture with cinematic grain',
  },
];
