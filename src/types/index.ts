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

export type FrameCategory = 'solid' | 'retro' | 'cute' | 'custom';

export interface FrameOption {
  id: string;
  name: string;
  category: FrameCategory;
  color: string;
  textColor: string;
  subtextColor: string;
  borderColor?: string;
  emoji?: string;
  isPro?: boolean;
  borderPreviewClass?: string;
  tagline?: string;
  isCustom?: boolean;
  customImageUrl?: string; // Data URL or object URL of uploaded custom frame template from Canva/Figma
}

export type AppStep = 'booth' | 'studio';

export type CaptureState = 'idle' | 'countdown' | 'flash' | 'captured' | 'next_pose' | 'completed';

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  poseIndex: number;
  timestamp: number;
}

export interface SlotCalibration {
  marginTopOffset: number; // in pixels, e.g. -30 to +30
  gapOffset: number; // in pixels, e.g. -10 to +25
  scaleFactor: number; // scale multiplier, e.g. 0.85 to 1.15
  marginSideOffset: number; // in pixels, e.g. -20 to +20
}

export interface StudioSettings {
  title: string;
  subtitle: string;
  showDate: boolean;
  showOuterBorder?: boolean;
  exportFormat?: 'png' | 'jpeg';
  slotCalibration: SlotCalibration;
}
