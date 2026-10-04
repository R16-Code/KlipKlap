/**
 * Type definitions for KlipKlap Korean Photobooth Studio
 */

export type LayoutType =
  | 'strip_1x4'
  | 'strip_1x3'
  | 'strip_1x2'
  | 'grid_2x2'
  | 'grid_3x3'
  | 'grid_2x3'
  | 'polaroid_1x1';

export interface LayoutConfig {
  id: LayoutType;
  name: string;
  subtitle: string;
  photoCount: number;
  columns: number;
  rows: number;
  aspectRatio: string;
}

export type FilterType =
  | 'normal'
  | 'bw'
  | 'sepia'
  | 'grain'
  | 'pastel'
  | 'fuji'
  | 'cyber'
  | 'cinema'
  | 'soft'
  | 'kodak'
  | 'moody_noir'
  | 'haru_blue'
  | 'cherry_blossom'
  | 'warm_latte'
  | 'vintage_90s';

export interface FilterOption {
  id: FilterType;
  name: string;
  koreanName: string;
  description: string;
}

export type FrameCategory = 'solid' | 'retro' | 'cute' | 'y2k';

export interface FrameOption {
  id: string;
  name: string;
  category: FrameCategory;
  color: string;
  textColor: string;
  subtextColor: string;
  borderColor?: string;
  emoji?: string;
  borderPreviewClass?: string;
  tagline?: string;
}

export type AppStep = 'booth' | 'studio';

export type CaptureState = 'idle' | 'countdown' | 'flash' | 'captured' | 'next_pose' | 'completed';

export type StudioPreviewMode = 'photo' | 'motion';

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  videoUrl?: string; // Blob URL of the short video clip for this pose
  isMirrored?: boolean; // Whether camera was mirrored when captured
  poseIndex: number;
  timestamp: number;
}

export interface SlotCalibration {
  marginTopOffset: number; // in pixels, e.g. -30 to +30
  gapOffset: number; // in pixels, e.g. -12 to +24
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
