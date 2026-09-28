import { create } from 'zustand';

interface AuthState {
  isPro: boolean;
  isProModalOpen: boolean;
  proFeatureAttempted: string | null;
  toggleProStatus: () => void;
  setProStatus: (status: boolean) => void;
  openProModal: (featureName?: string) => void;
  closeProModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isPro: false,
  isProModalOpen: false,
  proFeatureAttempted: null,

  toggleProStatus: () => set((state) => ({ isPro: !state.isPro })),
  
  setProStatus: (status: boolean) => set({ isPro: status }),

  openProModal: (featureName = 'This exclusive aesthetic') =>
    set({
      isProModalOpen: true,
      proFeatureAttempted: featureName,
    }),

  closeProModal: () =>
    set({
      isProModalOpen: false,
      proFeatureAttempted: null,
    }),
}));
