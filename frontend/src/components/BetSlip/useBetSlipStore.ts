import { create } from 'zustand'

export interface BetSelection {
  id: string;
  matchName: string;
  marketName: string;
  outcomeName: string;
  odds: number;
  stake: number;
  isLive?: boolean;
}

interface BetSlipStore {
  mode: 'single' | 'parlay';
  selections: BetSelection[];
  globalStake: number;
  setMode: (mode: 'single' | 'parlay') => void;
  addSelection: (selection: BetSelection) => void;
  removeSelection: (id: string) => void;
  updateStake: (id: string, stake: number) => void;
  setGlobalStake: (stake: number) => void;
  clearSelections: () => void;
}

export const useBetSlipStore = create<BetSlipStore>((set) => ({
  mode: 'single',
  selections: [],
  globalStake: 0,
  setMode: (mode) => set({ mode }),
  addSelection: (selection) => set((state) => {
    const exists = state.selections.find((s) => s.id === selection.id);
    if (exists) return state;
    return { selections: [...state.selections, selection] };
  }),
  removeSelection: (id) => set((state) => ({
    selections: state.selections.filter((s) => s.id !== id),
  })),
  updateStake: (id, stake) => set((state) => ({
    selections: state.selections.map((s) => 
      s.id === id ? { ...s, stake } : s
    ),
  })),
  setGlobalStake: (stake) => set({ globalStake: stake }),
  clearSelections: () => set({ selections: [], globalStake: 0 }),
}))
