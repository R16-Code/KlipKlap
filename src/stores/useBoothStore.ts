import { create } from 'zustand';
import type {
  LayoutType,
  FilterType,
  AppStep,
  CaptureState,
  CapturedPhoto,
  StudioSettings,
} from '../types';
import { LAYOUT_CONFIGS } from '../utils/constants';

interface BoothState {
  // Navigation
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;

  // Layout selection
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;

  // Camera settings
  isMirrored: boolean;
  setIsMirrored: (mirrored: boolean) => void;
  toggleMirror: () => void;
  timerDuration: number; // 3 or 5 seconds
  setTimerDuration: (seconds: number) => void;

  // Capture sequence state machine
  captureState: CaptureState;
  setCaptureState: (state: CaptureState) => void;
  countdownValue: number;
  setCountdownValue: (val: number) => void;
  currentPoseIndex: number;
  setCurrentPoseIndex: (index: number) => void;
  isCapturing: boolean;
  setIsCapturing: (capturing: boolean) => void;

  // Photos
  capturedPhotos: CapturedPhoto[];
  addPhoto: (photo: CapturedPhoto) => void;
  retakeSinglePhoto: (index: number) => void;
  clearPhotos: () => void;
  resetSession: () => void;

  // Studio customization
  selectedFrame: string;
  setSelectedFrame: (frameId: string) => void;
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  studioSettings: StudioSettings;
  updateStudioSettings: (settings: Partial<StudioSettings>) => void;
}

const DEFAULT_SETTINGS: StudioSettings = {
  title: 'KLIPKLAP STUDIO',
  subtitle: 'SELF PHOTO ARCHIVE',
  showDate: true,
};

export const useBoothStore = create<BoothState>((set, get) => ({
  currentStep: 'booth',
  setCurrentStep: (step) => set({ currentStep: step }),

  layout: 'strip_1x4',
  setLayout: (layout) => {
    const config = LAYOUT_CONFIGS[layout];
    const currentPhotos = get().capturedPhotos;
    // Trim photos if changing to layout with fewer slots
    const trimmed = currentPhotos.slice(0, config.photoCount);
    set({
      layout,
      capturedPhotos: trimmed,
      currentPoseIndex: Math.min(get().currentPoseIndex, config.photoCount - 1),
    });
  },

  isMirrored: true,
  setIsMirrored: (mirrored) => set({ isMirrored: mirrored }),
  toggleMirror: () => set((state) => ({ isMirrored: !state.isMirrored })),

  timerDuration: 3,
  setTimerDuration: (seconds) => set({ timerDuration: seconds }),

  captureState: 'idle',
  setCaptureState: (captureState) => set({ captureState }),
  countdownValue: 3,
  setCountdownValue: (countdownValue) => set({ countdownValue }),
  currentPoseIndex: 0,
  setCurrentPoseIndex: (currentPoseIndex) => set({ currentPoseIndex }),
  isCapturing: false,
  setIsCapturing: (isCapturing) => set({ isCapturing }),

  capturedPhotos: [],
  addPhoto: (photo) => {
    set((state) => {
      const nextPhotos = [...state.capturedPhotos];
      nextPhotos[photo.poseIndex] = photo;
      return { capturedPhotos: nextPhotos };
    });
  },

  retakeSinglePhoto: (index) => {
    set((state) => {
      const updated = state.capturedPhotos.filter((p) => p.poseIndex !== index);
      return {
        capturedPhotos: updated,
        currentPoseIndex: index,
        currentStep: 'booth',
        captureState: 'idle',
      };
    });
  },

  clearPhotos: () => set({ capturedPhotos: [], currentPoseIndex: 0, captureState: 'idle' }),

  resetSession: () => {
    set({
      currentStep: 'booth',
      captureState: 'idle',
      countdownValue: get().timerDuration,
      currentPoseIndex: 0,
      isCapturing: false,
      capturedPhotos: [],
      selectedFilter: 'normal',
      selectedFrame: 'cloud_white',
    });
  },

  selectedFrame: 'cloud_white',
  setSelectedFrame: (frameId) => set({ selectedFrame: frameId }),

  selectedFilter: 'normal',
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),

  studioSettings: DEFAULT_SETTINGS,
  updateStudioSettings: (settings) =>
    set((state) => ({
      studioSettings: { ...state.studioSettings, ...settings },
    })),
}));
