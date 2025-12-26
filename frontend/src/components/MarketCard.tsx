/**
 * 盘口卡片组件
 * 展示单个盘口的所有投注选项
 */

import React from 'react';
import { ClassifiedMarket } from '../utils/marketClassifier';

interface MarketCardProps {
  market: ClassifiedMarket;
  onOutcomeClick?: (marketId: number, specifierId: number, outcomeId: string | number) => void;
}

/**
 * 获取赔率状态的样式类
 */
function getOutcomeStatusClass(active: number): string {
  switch (active) {
    case 1:
      return 'bg-blue-50 hover:bg-blue-100 cursor-pointer border-blue-200';
    case -1:
      return 'bg-gray-100 cursor-not-allowed border-gray-300 opacity-60';
    case 0:
    case -2:
    case -3:
    case -4:
      return 'hidden'; // 隐藏这些状态的选项
    default:
      return 'bg-gray-50 border-gray-200';
  }
}

/**
 * 格式化赔率显示
 */
function formatOdds(odds: number): string {
  return odds.toFixed(2);
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onOutcomeClick }) => {
  // 检查是否有任何 specifier 是滚球盘
  const hasLiveMarket = market.specifiers.some(spec => spec.product === 1);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 卡片头部 */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{market.name}</h3>
        {hasLiveMarket && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
            Live
          </span>
        )}
      </div>

      {/* 卡片内容 - 每个 Specifier 为一行 */}
      <div className="divide-y divide-gray-100">
        {market.specifiers.map((specifier) => {
          // 过滤掉不活跃的 outcomes
          const activeOutcomes = specifier.outcomes.filter(
            outcome => outcome.active !== 0 && outcome.active !== -2 && outcome.active !== -3 && outcome.active !== -4
          );

          if (activeOutcomes.length === 0) return null;

          return (
            <div key={specifier.id} className="p-3">
              {/* Specifier 信息（如果有值） */}
              {specifier.specifier_value && (
                <div className="text-xs text-gray-500 mb-2">
                  {specifier.specifier_value}
                </div>
              )}

              {/* Outcomes 网格 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {activeOutcomes.map((outcome) => {
                  const isActive = outcome.active === 1;
                  const statusClass = getOutcomeStatusClass(outcome.active);

                  return (
                    <button
                      key={outcome.id}
                      className={`
                        px-3 py-2 rounded border transition-colors
                        ${statusClass}
                        ${isActive ? 'hover:shadow-sm' : ''}
                      `}
                      disabled={!isActive}
                      onClick={() => {
                        if (isActive && onOutcomeClick) {
                          onOutcomeClick(market.market_id, specifier.id, outcome.id);
                        }
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium text-gray-900 mb-1">
                          {outcome.name}
                        </span>
                        <span className={`text-xs font-semibold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                          {formatOdds(outcome.odds)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
