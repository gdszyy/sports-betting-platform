import React, { useEffect, useState } from 'react';
import type { BetSelection } from './useBetSlipStore';
import { useBetSlipStore } from './useBetSlipStore';

interface BetSlipItemProps {
  selection: BetSelection;
}

const BetSlipItem: React.FC<BetSlipItemProps> = ({ selection }) => {
  const { mode, removeSelection, updateStake } = useBetSlipStore();
  const [highlight, setHighlight] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (selection.oddsTrend === 'up') {
      setHighlight('up');
      const timer = setTimeout(() => setHighlight(null), 3000);
      return () => clearTimeout(timer);
    } else if (selection.oddsTrend === 'down') {
      setHighlight('down');
      const timer = setTimeout(() => setHighlight(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [selection.odds, selection.oddsTrend]);

  const isDisabled = selection.isLocked || selection.isInvalid;

  return (
    <div className={`p-3 mb-2 rounded-md border transition-all duration-500 ${
      isDisabled 
        ? 'bg-gray-800 border-gray-700 opacity-60' 
        : highlight === 'up'
          ? 'bg-green-900/40 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
          : highlight === 'down'
            ? 'bg-red-900/40 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
            : 'bg-gray-700 border-gray-600'
    }`}>
      <div className='flex justify-between items-start mb-2'>
        <div className='flex-1'>
          <div className='text-xs text-gray-400 mb-1 flex items-center'>
            {selection.matchName}
            {selection.isLocked && (
              <span className='ml-2 px-1 bg-gray-600 text-[10px] text-white rounded'>已锁盘</span>
            )}
            {selection.isInvalid && (
              <span className='ml-2 px-1 bg-red-600 text-[10px] text-white rounded'>已失效</span>
            )}
          </div>
          <div className='text-sm font-semibold text-white'>{selection.outcomeName}</div>
          <div className='text-xs text-gray-300'>{selection.marketName} {selection.specifiers && `(${selection.specifiers})`}</div>
        </div>
        <div className='flex flex-col items-end'>
          <button 
            onClick={() => removeSelection(selection.id)}
            className='text-gray-500 hover:text-red-400 mb-1'
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
          <div className='flex items-center'>
            {highlight === 'up' && (
              <svg xmlns='http://www.w3.org/2000/svg' className='h-3 w-3 text-green-400 mr-1 animate-bounce' viewBox='0 0 20 20' fill='currentColor'>
                <path fillRule='evenodd' d='M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z' clipRule='evenodd' />
              </svg>
            )}
            {highlight === 'down' && (
              <svg xmlns='http://www.w3.org/2000/svg' className='h-3 w-3 text-red-400 mr-1 animate-bounce' viewBox='0 0 20 20' fill='currentColor'>
                <path fillRule='evenodd' d='M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 112 0v7.586l2.293-2.293a1 1 0 011.414 0z' clipRule='evenodd' />
              </svg>
            )}
            <span className={`font-bold transition-colors duration-300 ${
              isDisabled ? 'text-gray-500' : highlight === 'up' ? 'text-green-400' : highlight === 'down' ? 'text-red-400' : 'text-blue-400'
            }`}>
              {isDisabled ? '--' : selection.odds.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      {mode === 'single' && (
        <div className='mt-3 flex items-center'>
          <div className='relative flex-1'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>¥</span>
            <input
              type='number'
              disabled={isDisabled}
              value={selection.stake || ''}
              onChange={(e) => updateStake(selection.id, parseFloat(e.target.value) || 0)}
              placeholder={isDisabled ? '无法投注' : '投注金额'}
              className={`w-full bg-gray-800 text-white text-sm pl-7 pr-3 py-2 rounded border focus:outline-none transition-colors ${
                isDisabled ? 'border-gray-700 text-gray-600 cursor-not-allowed' : 'border-gray-600 focus:border-blue-500'
              }`}
            />
          </div>
          <div className='ml-3 text-right'>
            <div className='text-xs text-gray-400'>预计返还</div>
            <div className='text-sm font-medium text-green-400'>
              ¥{isDisabled ? '0.00' : ((selection.stake || 0) * selection.odds).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetSlipItem;