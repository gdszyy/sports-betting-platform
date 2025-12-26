import React from 'react';
import { useBetSlipStore } from './useBetSlipStore';
import { clsx } from 'clsx';

const BetSlipHeader: React.FC = () => {
  const { mode, setMode } = useBetSlipStore();

  return (
    <div className="flex border-b border-gray-200">
      <button
        className={clsx(
          'flex-1 py-3 text-sm font-medium transition-colors',
          mode === 'single'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        )}
        onClick={() => setMode('single')}
      >
        单关
      </button>
      <button
        className={clsx(
          'flex-1 py-3 text-sm font-medium transition-colors',
          mode === 'parlay'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        )}
        onClick={() => setMode('parlay')}
      >
        串关
      </button>
    </div>
  );
};

export default BetSlipHeader;
