import React from 'react';
import { useBetSlipStore } from './useBetSlipStore';

const BetSlipHeader: React.FC = () => {
  const { mode, setMode, selections, clearSelections } = useBetSlipStore();

  return (
    <div className="flex flex-col w-full bg-gray-800 text-white p-4 rounded-t-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">投注单 ({selections.length})</h2>
        <button 
          onClick={clearSelections}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          全部清除
        </button>
      </div>
      <div className="flex bg-gray-900 p-1 rounded-md">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            mode === 'single'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setMode('single')}
        >
          单关
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            mode === 'parlay'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setMode('parlay')}
        >
          串关
        </button>
      </div>
    </div>
  );
};

export default BetSlipHeader;
