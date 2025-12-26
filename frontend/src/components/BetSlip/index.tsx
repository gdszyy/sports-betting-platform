import React, { useEffect } from 'react';
import BetSlipHeader from './BetSlipHeader';
import BetSlipItem from './BetSlipItem';
import BetSlipFooter from './BetSlipFooter';
import { useBetSlipStore } from './useBetSlipStore';

const BetSlip: React.FC = () => {
  const { selections, addSelection } = useBetSlipStore();

  // 模拟添加一些初始数据用于演示
  useEffect(() => {
    if (selections.length === 0) {
      addSelection({
        id: '1',
        matchName: '皇家马德里 vs 巴塞罗那',
        marketName: '全场胜平负',
        outcomeName: '皇家马德里',
        odds: 2.15,
        stake: 0,
        isLive: true,
      });
      addSelection({
        id: '2',
        matchName: '洛杉矶湖人 vs 金州勇士',
        marketName: '让分盘',
        outcomeName: '金州勇士 -3.5',
        odds: 1.88,
        stake: 0,
      });
    }
  }, []);

  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      <div className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
        <h2 className="font-bold text-base">投注单</h2>
        <span className="bg-blue-600 text-[10px] px-1.5 py-0.5 rounded-full">
          {selections.length}
        </span>
      </div>
      
      <BetSlipHeader />
      
      <div className="flex-1 overflow-y-auto max-h-[400px] min-h-[100px] bg-gray-50">
        {selections.length > 0 ? (
          selections.map((selection) => (
            <BetSlipItem key={selection.id} selection={selection} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <p className="text-sm">您的投注单是空的</p>
            <p className="text-xs mt-1">请点击赔率添加投注选项</p>
          </div>
        )}
      </div>

      <BetSlipFooter />
    </div>
  );
};

export default BetSlip;
