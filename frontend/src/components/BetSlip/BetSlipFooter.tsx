import React from 'react';
import { useBetSlipStore } from './useBetSlipStore';

const BetSlipFooter: React.FC = () => {
  const { mode, selections, globalStake, setGlobalStake, clearSelections } = useBetSlipStore();

  const totalStake = mode === 'single' 
    ? selections.reduce((sum, s) => sum + (s.stake || 0), 0)
    : globalStake;

  const parlayOdds = selections.reduce((acc, s) => acc * s.odds, 1);
  
  const potentialReturn = mode === 'single'
    ? selections.reduce((sum, s) => sum + (s.stake || 0) * s.odds, 0)
    : globalStake * parlayOdds;

  if (selections.length === 0) return null;

  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      {mode === 'parlay' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">串关 ({selections.length} 串 1)</span>
            <span className="text-sm font-bold text-blue-600">@{parlayOdds.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-[150px]">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">¥</span>
              <input
                type="number"
                value={globalStake || ''}
                onChange={(e) => setGlobalStake(Number(e.target.value))}
                placeholder="总投注额"
                className="w-full pl-5 pr-2 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-400">预计返还</div>
              <div className="text-base font-bold text-orange-500">
                ¥{potentialReturn.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">总投注额</span>
        <span className="text-lg font-bold text-gray-900">¥{totalStake.toFixed(2)}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={clearSelections}
          className="flex-1 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
        >
          清空
        </button>
        <button
          className="flex-[2] py-3 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm"
          onClick={() => alert('投注成功！')}
        >
          立即下注
        </button>
      </div>
    </div>
  );
};

export default BetSlipFooter;
