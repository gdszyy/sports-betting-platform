import React from 'react';
import { useBetSlipStore } from './useBetSlipStore';

const BetSlipFooter: React.FC = () => {
  const { 
    mode, 
    selections, 
    globalStake, 
    setGlobalStake, 
    oddsChangePolicy, 
    setOddsChangePolicy 
  } = useBetSlipStore();

  const totalOdds = selections.reduce((acc, curr) => acc * curr.odds, 1);
  const totalStake = mode === 'single' 
    ? selections.reduce((acc, curr) => acc + (curr.stake || 0), 0)
    : globalStake;
  const potentialReturn = mode === 'single'
    ? selections.reduce((acc, curr) => acc + ((curr.stake || 0) * curr.odds), 0)
    : globalStake * totalOdds;

  const hasParlayConflict = mode === 'parlay' && (() => {
    const matchIds = selections.map(s => s.matchId);
    return new Set(matchIds).size !== matchIds.length;
  })();

  const hasDisabledSelection = selections.some(s => s.isLocked || s.isInvalid);

  const isSubmitDisabled = 
    totalStake <= 0 || 
    hasParlayConflict || 
    (mode === 'parlay' && hasDisabledSelection) ||
    selections.length === 0;

  if (selections.length === 0) {
    return (
      <div className='p-8 text-center text-gray-500 bg-gray-800 rounded-b-lg'>
        请选择赔率进行投注
      </div>
    );
  }

  return (
    <div className='bg-gray-800 p-4 border-t border-gray-700 rounded-b-lg'>
      {mode === 'parlay' && (
        <div className='mb-4'>
          {hasParlayConflict && (
            <div className='mb-3 p-2 bg-red-900/30 border border-red-500/50 rounded text-xs text-red-400 flex items-center animate-pulse'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-2 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z' />
              </svg>
              同一比赛的盘口无法串关
            </div>
          )}
          {hasDisabledSelection && (
            <div className='mb-3 p-2 bg-orange-900/30 border border-orange-500/50 rounded text-xs text-orange-400 flex items-center'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-2 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              包含已锁盘或失效的选项，无法串关
            </div>
          )}
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm text-gray-300'>串关 ({selections.length} 串 1)</span>
            <span className='text-sm font-bold text-blue-400'>@{totalOdds.toFixed(2)}</span>
          </div>
          <div className='flex items-center'>
            <div className='relative flex-1'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>¥</span>
              <input
                type='number'
                value={globalStake || ''}
                onChange={(e) => setGlobalStake(parseFloat(e.target.value) || 0)}
                placeholder='投注金额'
                className='w-full bg-gray-900 text-white text-sm pl-7 pr-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none'
              />
            </div>
          </div>
        </div>
      )}

      <div className='mb-4 p-3 bg-gray-900/50 rounded-md border border-gray-700'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-xs text-gray-400'>赔率变化设置</span>
          <select 
            value={oddsChangePolicy}
            onChange={(e) => setOddsChangePolicy(e.target.value as any)}
            className='bg-gray-800 text-xs text-blue-400 focus:outline-none cursor-pointer border border-gray-700 rounded px-1 py-0.5'
          >
            <option value='none'>不接受任何变化</option>
            <option value='any'>接受任何变化</option>
            <option value='higher'>只接受更高赔率</option>
          </select>
        </div>
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-400'>总投注额</span>
            <span className='text-white font-medium'>¥{totalStake.toFixed(2)}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-400'>预计总返还</span>
            <span className='text-green-400 font-bold text-lg'>¥{potentialReturn.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        disabled={isSubmitDisabled}
        className={`w-full py-3 rounded-md font-bold text-white transition-all ${
            ? 'bg-blue-600 hover:bg-blue-700 shadow-lg active:transform active:scale-[0.98]' 
            : 'bg-gray-600 cursor-not-allowed opacity-50'
        }`}
      >
        {hasParlayConflict ? '串关冲突' : '立即投注'}
      </button>
    </div>
  );
};

export default BetSlipFooter;