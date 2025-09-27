import { create } from 'zustand';

interface CalculatorState {
  isOpen: boolean;
  openCalculator: () => void;
  closeCalculator: () => void;
  toggleCalculator: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  isOpen: false,
  openCalculator: () => set({ isOpen: true }),
  closeCalculator: () => set({ isOpen: false }),
  toggleCalculator: () => set((state) => ({ isOpen: !state.isOpen })),
}));