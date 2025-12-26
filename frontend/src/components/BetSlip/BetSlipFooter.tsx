import React from 'react';
import { useBetSlipStore } from './useBetSlipStore';

const BetSlipFooter: React.FC = () => {
  const { mode, selections, globalStake, setGlobalStake } = useBetSlipStore();

  const totalStake = mode === 'single' 
    ? selections.reduce((sum, s) => sum + (s.stake || 0), 0)
    : globalStake;

  const totalOdds = mode === 'parlay' && selections.length > 0
    ? selections.reduce((prod, s) => prod * s.odds, 1)
    : 0;

  const potentialReturn = mode === 'single'
    ? selections.reduce((sum, s) => sum + (s.stake || 0) * s.odds, 0)
    : globalStake * totalOdds;

  if (selections.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-800 rounded-b-lg">
        请选择赔率进行投注
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700 rounded-b-lg">
      {mode === 'parlay' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">串关 ({selections.length} 串 1)</span>
            <span className="text-sm font-bold text-blue-400">@{totalOdds.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
              <input
                type="number"
                value={globalStake || ''}
                onChange={(e) => setGlobalStake(parseFloat(e.target.value) || 0)}
                placeholder="投注金额"
                className="w-full bg-gray-900 text-white text-sm pl-7 pr-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">总投注额</span>
          <span className="text-white font-medium">¥{totalStake.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">预计总返还</span>
          <span className="text-green-400 font-bold text-lg">¥{potentialReturn.toFixed(2)}</span>
        </div>
      </div>

      <button
        disabled={totalStake <= 0}
        className={`w-full py-3 rounded-md font-bold text-white transition-all ${
          totalStake > 0 
            ? 'bg-blue-600 hover:bg-blue-700 shadow-lg active:transform active:scale-[0.98]' 
            : 'bg-gray-600 cursor-not-allowed'
        }`}
      >
        立即投注
      </button>
    </div>
  );
};

export default BetSlipFooter;
