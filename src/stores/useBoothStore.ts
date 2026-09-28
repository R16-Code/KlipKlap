import { create } from 'zustand';
import type {
  LayoutType,
  FilterType,
  AppStep,
  CaptureState,
  CapturedPhoto,
  StudioSettings,
  FrameOption,
  SlotCalibration,
} from '../types';

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
  customFrames: FrameOption[];
  addCustomFrame: (frame: FrameOption) => void;
  removeCustomFrame: (id: string) => void;
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  studioSettings: StudioSettings;
  updateStudioSettings: (settings: Partial<StudioSettings>) => void;
  updateSlotCalibration: (cal: Partial<SlotCalibration>) => void;
  resetSlotCalibration: () => void;
}

const DEFAULT_CALIBRATION: SlotCalibration = {
  marginTopOffset: 0,
  gapOffset: 0,
  scaleFactor: 1,
  marginSideOffset: 0,
};

const DEFAULT_SETTINGS: StudioSettings = {
  title: 'KLIPKLAP STUDIO',
  subtitle: 'SELF PHOTO ARCHIVE',
  showDate: true,
  slotCalibration: DEFAULT_CALIBRATION,
};

export const useBoothStore = create<BoothState>((set, get) => ({
  currentStep: 'booth',
  setCurrentStep: (step) => set({ currentStep: step }),

  layout: 'strip_1x4',
  setLayout: (layout) => {
    // Preserve all captured photos so switching layouts (e.g. 1x4 -> 1x2 -> 1x4) never loses photos!
    set({ layout });
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

  customFrames: [],
  addCustomFrame: (frame) =>
    set((state) => ({
      customFrames: [frame, ...state.customFrames],
      selectedFrame: frame.id,
    })),
  removeCustomFrame: (id) =>
    set((state) => ({
      customFrames: state.customFrames.filter((f) => f.id !== id),
      selectedFrame: state.selectedFrame === id ? 'cloud_white' : state.selectedFrame,
    })),

  selectedFilter: 'normal',
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),

  studioSettings: DEFAULT_SETTINGS,
  updateStudioSettings: (settings) =>
    set((state) => ({
      studioSettings: { ...state.studioSettings, ...settings },
    })),
  updateSlotCalibration: (cal) =>
    set((state) => ({
      studioSettings: {
        ...state.studioSettings,
        slotCalibration: {
          ...state.studioSettings.slotCalibration,
          ...cal,
        },
      },
    })),
  resetSlotCalibration: () =>
    set((state) => ({
      studioSettings: {
        ...state.studioSettings,
        slotCalibration: DEFAULT_CALIBRATION,
      },
    })),
}));
