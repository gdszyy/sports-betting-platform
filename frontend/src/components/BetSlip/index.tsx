import React from 'react';
import BetSlipHeader from './BetSlipHeader';
import BetSlipItem from './BetSlipItem';
import BetSlipFooter from './BetSlipFooter';
import { useBetSlipStore } from './useBetSlipStore';

const BetSlip: React.FC = () => {
  const { selections } = useBetSlipStore();

  return (
    <div className="flex flex-col w-full max-w-md bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
      <BetSlipHeader />
      
      <div className="flex-1 overflow-y-auto max-h-[500px] p-4 bg-gray-900 custom-scrollbar">
        {selections.length > 0 ? (
          selections.map((selection) => (
            <BetSlipItem key={selection.id} selection={selection} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>您的投注单是空的</p>
          </div>
        )}
      </div>

      <BetSlipFooter />
    </div>
  );
};

export default BetSlip;
