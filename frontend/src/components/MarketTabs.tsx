/**
 * 盘口 Tab & Chip 组件
 * 实现两级分类导航
 */

import React, { useState } from 'react';
import {
  ClassifiedMarket,
  GroupedMarkets,
  getTabList,
  getChipList,
  formatChipLabel,
} from '../utils/marketClassifier';
import { MarketCard } from './MarketCard';

interface MarketTabsProps {
  groupedMarkets: GroupedMarkets;
  onOutcomeClick?: (marketId: number, specifierId: number, outcomeId: string | number) => void;
}

export const MarketTabs: React.FC<MarketTabsProps> = ({ groupedMarkets, onOutcomeClick }) => {
  const tabs = getTabList(groupedMarkets);
  const [activeTab, setActiveTab] = useState<string>(tabs[0] || '流行');
  const [activeChip, setActiveChip] = useState<string>('');

  // 当切换 Tab 时，重置 Chip 选择
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setActiveChip('');
  };

  // 获取当前 Tab 下的 Chips
  const chips = getChipList(groupedMarkets, activeTab);

  // 获取当前要显示的盘口列表
  const getDisplayMarkets = (): ClassifiedMarket[] => {
    if (!groupedMarkets[activeTab]) return [];

    if (activeChip && groupedMarkets[activeTab][activeChip]) {
      // 如果选择了 Chip，只显示该 Chip 下的盘口
      return groupedMarkets[activeTab][activeChip];
    } else {
      // 否则显示该 Tab 下的所有盘口
      const allMarkets: ClassifiedMarket[] = [];
      for (const chipId in groupedMarkets[activeTab]) {
        allMarkets.push(...groupedMarkets[activeTab][chipId]);
      }
      return allMarkets;
    }
  };

  const displayMarkets = getDisplayMarkets();

  if (tabs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无盘口数据
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Tab 导航 */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tabId) => (
            <button
              key={tabId}
              onClick={() => handleTabChange(tabId)}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors
                border-b-2 -mb-px
                ${
                  activeTab === tabId
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {tabId}
            </button>
          ))}
        </div>
      </div>

      {/* Chip 导航（如果有） */}
      {chips.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {/* "全部" 选项 */}
            <button
              onClick={() => setActiveChip('')}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${
                  activeChip === ''
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }
              `}
            >
              全部
            </button>

            {/* Chip 选项 */}
            {chips.map((chipId) => (
              <button
                key={chipId}
                onClick={() => setActiveChip(chipId)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${
                    activeChip === chipId
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }
                `}
              >
                {formatChipLabel(chipId)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 盘口列表 */}
      <div className="p-4 space-y-4">
        {displayMarkets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            该分类下暂无盘口
          </div>
        ) : (
          displayMarkets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onOutcomeClick={onOutcomeClick}
            />
          ))
        )}
      </div>
    </div>
  );
};
