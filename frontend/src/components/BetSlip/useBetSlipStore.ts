import { create } from 'zustand';

export interface BetSelection {
  id: string;
  matchId: string;
  matchName: string;
  marketId: string;
  marketName: string;
  outcomeId: string;
  outcomeName: string;
  odds: number;
  specifiers?: string;
  stake?: number;
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
  addSelection: (selection) =>
    set((state) => {
      const exists = state.selections.find((s) => s.id === selection.id);
      if (exists) {
        return { selections: state.selections.filter((s) => s.id !== selection.id) };
      }
      return { selections: [...state.selections, { ...selection, stake: 0 }] };
    }),
  removeSelection: (id) =>
    set((state) => ({
      selections: state.selections.filter((s) => s.id !== id),
    })),
  updateStake: (id, stake) =>
    set((state) => ({
      selections: state.selections.map((s) =>
        s.id === id ? { ...s, stake } : s
      ),
    })),
  setGlobalStake: (globalStake) => set({ globalStake }),
  clearSelections: () => set({ selections: [], globalStake: 0 }),
}));
