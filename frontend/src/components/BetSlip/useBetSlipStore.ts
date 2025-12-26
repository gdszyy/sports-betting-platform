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
  oddsChangePolicy: 'none' | 'any' | 'higher';
  setOddsChangePolicy: (policy: 'none' | 'any' | 'higher') => void;
  clearSelections: () => void;
}

export const useBetSlipStore = create<BetSlipStore>((set) => ({
  mode: 'single',
  selections: [],
  globalStake: 0,
  oddsChangePolicy: 'higher',
  setMode: (mode) => set({ mode }),
  addSelection: (selection) =>
    set((state) => {
      const exists = state.selections.find((s) => s.id === selection.id);
      if (exists) {
        // 如果已存在，则移除（切换选中状态）
        return { selections: state.selections.filter((s) => s.id !== selection.id) };
      }
      // 如果不存在，则添加，初始金额为 0
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
  setOddsChangePolicy: (oddsChangePolicy) => set({ oddsChangePolicy }),
  clearSelections: () => set({ selections: [], globalStake: 0 }),
}));
