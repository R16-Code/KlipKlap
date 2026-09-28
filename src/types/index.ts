/**
 * Type definitions for KlipKlap Korean Photobooth Studio
 */

export type LayoutType = 'strip_1x3' | 'strip_1x4' | 'grid_2x2' | 'strip_1x2';

export interface LayoutConfig {
  id: LayoutType;
  name: string;
  subtitle: string;
  photoCount: number;
  columns: number;
  rows: number;
  aspectRatio: string;
  isPro?: boolean;
}

export type FilterType = 'normal' | 'bw' | 'sepia' | 'grain';

export interface FilterOption {
  id: FilterType;
  name: string;
  koreanName: string;
  description: string;
  isPro?: boolean;
}

export interface FrameOption {
  id: string;
  name: string;
  color: string;
  textColor: string;
  subtextColor: string;
  isPro?: boolean;
  borderPreviewClass: string;
}

export type AppStep = 'booth' | 'studio';

export type CaptureState = 'idle' | 'countdown' | 'flash' | 'captured' | 'next_pose' | 'completed';

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  poseIndex: number;
  timestamp: number;
}

export interface StudioSettings {
  title: string;
  subtitle: string;
  showDate: boolean;
  showStickers?: boolean;
}
