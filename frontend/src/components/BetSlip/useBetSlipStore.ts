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
  // 新增状态字段
  isLocked?: boolean;
  isInvalid?: boolean;
  oddsTrend?: 'up' | 'down' | 'stable';
  lastOdds?: number;
}

interface BetSlipStore {
  mode: 'single' | 'parlay';
  selections: BetSelection[];
  globalStake: number;
  setMode: (mode: 'single' | 'parlay') => void;
  addSelection: (selection: BetSelection) => void;
  removeSelection: (id: string) => void;
  updateStake: (id: string, stake: number) => void;
  updateOdds: (id: string, newOdds: number) => void;
  setLocked: (id: string, isLocked: boolean) => void;
  setInvalid: (id: string, isInvalid: boolean) => void;
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
        return { selections: state.selections.filter((s) => s.id !== selection.id) };
      }
      return { selections: [...state.selections, { ...selection, stake: 0, oddsTrend: 'stable' }] };
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
  updateOdds: (id, newOdds) =>
    set((state) => ({
      selections: state.selections.map((s) => {
        if (s.id === id) {
          const trend = newOdds > s.odds ? 'up' : newOdds < s.odds ? 'down' : 'stable';
          return { ...s, lastOdds: s.odds, odds: newOdds, oddsTrend: trend };
        }
        return s;
      }),
    })),
  setLocked: (id, isLocked) =>
    set((state) => ({
      selections: state.selections.map((s) =>
        s.id === id ? { ...s, isLocked } : s
      ),
    })),
  setInvalid: (id, isInvalid) =>
    set((state) => ({
      selections: state.selections.map((s) =>
        s.id === id ? { ...s, isInvalid } : s
      ),
    })),
  setGlobalStake: (globalStake) => set({ globalStake }),
  setOddsChangePolicy: (oddsChangePolicy) => set({ oddsChangePolicy }),
  clearSelections: () => set({ selections: [], globalStake: 0 }),
}));
