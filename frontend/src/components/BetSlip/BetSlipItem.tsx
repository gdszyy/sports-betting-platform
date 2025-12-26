import React from 'react';
import type { BetSelection } from './useBetSlipStore';
import { useBetSlipStore } from './useBetSlipStore';

interface BetSlipItemProps {
  selection: BetSelection;
}

const BetSlipItem: React.FC<BetSlipItemProps> = ({ selection }) => {
  const { mode, removeSelection, updateStake } = useBetSlipStore();

  return (
    <div className="bg-gray-700 p-3 mb-2 rounded-md border border-gray-600">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">{selection.matchName}</div>
          <div className="text-sm font-semibold text-white">{selection.outcomeName}</div>
          <div className="text-xs text-gray-300">{selection.marketName} {selection.specifiers && `(${selection.specifiers})`}</div>
        </div>
        <div className="flex flex-col items-end">
          <button 
            onClick={() => removeSelection(selection.id)}
            className="text-gray-500 hover:text-red-400 mb-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-blue-400 font-bold">{selection.odds.toFixed(2)}</span>
        </div>
      </div>

      {mode === 'single' && (
        <div className="mt-3 flex items-center">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
            <input
              type="number"
              value={selection.stake || ''}
              onChange={(e) => updateStake(selection.id, parseFloat(e.target.value) || 0)}
              placeholder="投注金额"
              className="w-full bg-gray-800 text-white text-sm pl-7 pr-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="ml-3 text-right">
            <div className="text-xs text-gray-400">预计返还</div>
            <div className="text-sm font-medium text-green-400">
              ¥{((selection.stake || 0) * selection.odds).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetSlipItem;
