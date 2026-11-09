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

export type FrameCategory = 'solid' | 'pattern' | 'retro' | 'cute' | 'y2k';

export type BackgroundPatternId =
  | 'pattern_pastel_grid'
  | 'pattern_checker_pink'
  | 'pattern_checker_beige'
  | 'pattern_polka_dots'
  | 'pattern_polka_black'
  | 'pattern_y2k_stars'
  | 'pattern_vintage_paper'
  | 'pattern_gradient_cotton'
  | 'pattern_gradient_sunset'
  | 'pattern_gradient_ocean';

export interface BackgroundPatternOption {
  id: BackgroundPatternId;
  name: string;
  emoji: string;
  textColor: 'dark' | 'light';
  tagline: string;
  previewBg: string; // CSS style or gradient for UI buttons
}

export interface CustomBackground {
  type: 'none' | 'preset' | 'upload';
  presetId?: BackgroundPatternId;
  imageUrl?: string; // Base64 data URL from imageOptimizer
  textColor?: 'dark' | 'light'; // Text contrast for title, subtitle, date stamp
  offsetX?: number; // -100 to 100 (horizontal pan percentage)
  offsetY?: number; // -100 to 100 (vertical pan percentage)
  zoom?: number; // 1.0 to 2.5 (zoom multiplier)
}

export type StickerCategory = 'cute' | 'props' | 'y2k' | 'stamps';

export interface StickerDefinition {
  id: string;
  name: string;
  category: StickerCategory;
  svgDataUrl: string;
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  x: number; // Normalized 0.0 to 1.0 relative to canvas width
  y: number; // Normalized 0.0 to 1.0 relative to canvas height
  scale: number; // Scale multiplier (0.4 to 2.5, default 1.0)
  rotation: number; // Degrees (-180 to 180, default 0)
  flipX?: boolean;
}

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
