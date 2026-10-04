import { create } from 'zustand';
import type {
  LayoutType,
  FilterType,
  AppStep,
  CaptureState,
  CapturedPhoto,
  StudioSettings,
  SlotCalibration,
  StudioPreviewMode,
} from '../types';

interface BoothState {
  // Navigation
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;

  // Studio Preview Mode ('photo' = static photo strip, 'motion' = live moving photostrip)
  previewMode: StudioPreviewMode;
  setPreviewMode: (mode: StudioPreviewMode) => void;
  isExportingVideo: boolean;
  setIsExportingVideo: (exporting: boolean) => void;
  studioVideoElements: Map<number, HTMLVideoElement> | null;
  setStudioVideoElements: (elements: Map<number, HTMLVideoElement> | null) => void;

  // Layout selection
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;

  // Camera settings
  isMirrored: boolean;
  setIsMirrored: (mirrored: boolean) => void;
  toggleMirror: () => void;
  timerDuration: number; // 3, 5, or 10 seconds
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
  swapPhotos: (indexA: number, indexB: number) => void;
  movePhoto: (fromIndex: number, toIndex: number) => void;
  clearPhotos: () => void;
  resetSession: () => void;

  // Studio customization
  selectedFrame: string;
  setSelectedFrame: (frameId: string) => void;
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

  previewMode: 'photo',
  setPreviewMode: (mode) => set({ previewMode: mode }),
  isExportingVideo: false,
  setIsExportingVideo: (isExportingVideo) => set({ isExportingVideo }),
  studioVideoElements: null,
  setStudioVideoElements: (studioVideoElements) => set({ studioVideoElements }),

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

  swapPhotos: (indexA, indexB) => {
    set((state) => {
      const photos = [...state.capturedPhotos];
      const photoA = photos.find((p) => p.poseIndex === indexA);
      const photoB = photos.find((p) => p.poseIndex === indexB);

      if (photoA && photoB) {
        const updated = photos.map((p) => {
          if (p.id === photoA.id) return { ...p, poseIndex: indexB };
          if (p.id === photoB.id) return { ...p, poseIndex: indexA };
          return p;
        });
        updated.sort((a, b) => a.poseIndex - b.poseIndex);
        return { capturedPhotos: updated };
      }

      if (photoA && !photoB) {
        const updated = photos.map((p) => {
          if (p.id === photoA.id) return { ...p, poseIndex: indexB };
          return p;
        });
        updated.sort((a, b) => a.poseIndex - b.poseIndex);
        return { capturedPhotos: updated };
      }

      if (!photoA && photoB) {
        const updated = photos.map((p) => {
          if (p.id === photoB.id) return { ...p, poseIndex: indexA };
          return p;
        });
        updated.sort((a, b) => a.poseIndex - b.poseIndex);
        return { capturedPhotos: updated };
      }

      return state;
    });
  },

  movePhoto: (fromIndex, toIndex) => {
    set((state) => {
      const photos = [...state.capturedPhotos];
      const targetPhoto = photos.find((p) => p.poseIndex === fromIndex);
      if (!targetPhoto) return state;

      // Adjust poseIndex of other photos shifting
      const updated = photos.map((p) => {
        if (p.id === targetPhoto.id) {
          return { ...p, poseIndex: toIndex };
        }
        if (fromIndex < toIndex) {
          if (p.poseIndex > fromIndex && p.poseIndex <= toIndex) {
            return { ...p, poseIndex: p.poseIndex - 1 };
          }
        } else if (fromIndex > toIndex) {
          if (p.poseIndex >= toIndex && p.poseIndex < fromIndex) {
            return { ...p, poseIndex: p.poseIndex + 1 };
          }
        }
        return p;
      });

      updated.sort((a, b) => a.poseIndex - b.poseIndex);
      return { capturedPhotos: updated };
    });
  },

  clearPhotos: () => {
    get().capturedPhotos.forEach((p) => {
      if (p.videoUrl) {
        try {
          URL.revokeObjectURL(p.videoUrl);
        } catch {
          // ignore
        }
      }
    });
    set({ capturedPhotos: [], currentPoseIndex: 0, captureState: 'idle' });
  },

  resetSession: () => {
    get().capturedPhotos.forEach((p) => {
      if (p.videoUrl) {
        try {
          URL.revokeObjectURL(p.videoUrl);
        } catch {
          // ignore
        }
      }
    });
    set({
      currentStep: 'booth',
      previewMode: 'photo',
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
