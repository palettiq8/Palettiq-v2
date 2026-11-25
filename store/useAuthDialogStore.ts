import { create } from "zustand";

interface AuthDialogState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
}

export const useAuthDialogStore = create<AuthDialogState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  openAuthDialog: () => set({ isOpen: true }),
  closeAuthDialog: () => set({ isOpen: false }),
}));
