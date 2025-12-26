import React from 'react';
import { X } from 'lucide-react';
import { useBetSlipStore, BetSelection } from './useBetSlipStore';

interface BetSlipItemProps {
  selection: BetSelection;
}

const BetSlipItem: React.FC<BetSlipItemProps> = ({ selection }) => {
  const { mode, removeSelection, updateStake } = useBetSlipStore();

  return (
    <div className="p-4 bg-white border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            {selection.isLive && (
              <span className="px-1 text-[10px] font-bold text-white bg-red-500 rounded">LIVE</span>
            )}
            <span className="text-xs text-gray-500">{selection.matchName}</span>
          </div>
          <div className="text-sm font-bold text-gray-900">{selection.outcomeName}</div>
          <div className="text-xs text-gray-600">{selection.marketName}</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-blue-600">{selection.odds.toFixed(2)}</span>
          <button 
            onClick={() => removeSelection(selection.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {mode === 'single' && (
        <div className="mt-3 flex items-center justify-between">
          <div className="relative flex-1 max-w-[120px]">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">¥</span>
            <input
              type="number"
              value={selection.stake || ''}
              onChange={(e) => updateStake(selection.id, Number(e.target.value))}
              placeholder="投注额"
              className="w-full pl-5 pr-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400">预计返还</div>
            <div className="text-sm font-medium text-orange-500">
              ¥{(selection.stake * selection.odds).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetSlipItem;
