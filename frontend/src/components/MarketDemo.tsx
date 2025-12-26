/**
 * 盘口展示演示页面
 * 用于测试 Tab & Chip 分类功能
 */

import React from 'react';
import { Market } from '../types/match';
import { classifyMarkets, groupMarketsByTabChip } from '../utils/marketClassifier';
import { MarketTabs } from './MarketTabs';

/**
 * 模拟盘口数据
 */
const mockMarkets: Market[] = [
  // 足球 - 流行盘口
  {
    id: 1,
    market_id: 1,
    match_id: 'sr:match:demo',
    groups: 'regular_play',
    name: '1X2',
    specifiers: [
      {
        id: 101,
        product: 1,
        specifier_value: '',
        timestamp: Date.now(),
        outcomes: [
          { id: '1', name: '主队胜', odds: 1.85, active: 1 },
          { id: 'X', name: '平局', odds: 3.50, active: 1 },
          { id: '2', name: '客队胜', odds: 4.20, active: 1 },
        ],
      },
    ],
  },
  {
    id: 2,
    market_id: 18,
    match_id: 'sr:match:demo',
    groups: 'regular_play',
    name: '让球盘',
    specifiers: [
      {
        id: 201,
        product: 1,
        specifier_value: 'hcp=-1.5',
        timestamp: Date.now(),
        outcomes: [
          { id: '1', name: '主队 -1.5', odds: 2.10, active: 1 },
          { id: '2', name: '客队 +1.5', odds: 1.75, active: 1 },
        ],
      },
      {
        id: 202,
        product: 1,
        specifier_value: 'hcp=-2.5',
        timestamp: Date.now(),
        outcomes: [
          { id: '1', name: '主队 -2.5', odds: 2.85, active: 1 },
          { id: '2', name: '客队 +2.5', odds: 1.45, active: 1 },
        ],
      },
    ],
  },
  {
    id: 3,
    market_id: 26,
    match_id: 'sr:match:demo',
    groups: 'regular_play',
    name: '大小球',
    specifiers: [
      {
        id: 301,
        product: 1,
        specifier_value: 'total=2.5',
        timestamp: Date.now(),
        outcomes: [
          { id: 'over', name: '大于 2.5', odds: 1.90, active: 1 },
          { id: 'under', name: '小于 2.5', odds: 1.95, active: 1 },
        ],
      },
      {
        id: 302,
        product: 1,
        specifier_value: 'total=3.5',
        timestamp: Date.now(),
        outcomes: [
          { id: 'over', name: '大于 3.5', odds: 2.75, active: 1 },
          { id: 'under', name: '小于 3.5', odds: 1.50, active: 1 },
        ],
      },
    ],
  },
  // 足球 - 进球盘口
  {
    id: 4,
    market_id: 29,
    match_id: 'sr:match:demo',
    groups: 'score|goals',
    name: '总进球数',
    specifiers: [
      {
        id: 401,
        product: 3,
        specifier_value: '',
        timestamp: Date.now(),
        outcomes: [
          { id: '0-1', name: '0-1球', odds: 3.20, active: 1 },
          { id: '2-3', name: '2-3球', odds: 2.10, active: 1 },
          { id: '4-6', name: '4-6球', odds: 3.50, active: 1 },
          { id: '7+', name: '7球以上', odds: 15.00, active: 1 },
        ],
      },
    ],
  },
  {
    id: 5,
    market_id: 60,
    match_id: 'sr:match:demo',
    groups: 'score',
    name: '双方都进球',
    specifiers: [
      {
        id: 501,
        product: 3,
        specifier_value: '',
        timestamp: Date.now(),
        outcomes: [
          { id: 'yes', name: '是', odds: 1.70, active: 1 },
          { id: 'no', name: '否', odds: 2.20, active: 1 },
        ],
      },
    ],
  },
  // 篮球 - 四分之一决赛
  {
    id: 6,
    market_id: 223,
    match_id: 'sr:match:demo',
    groups: 'quarters',
    name: '单节胜负',
    specifiers: [
      {
        id: 601,
        product: 1,
        specifier_value: 'quarternr=1',
        timestamp: Date.now(),
        outcomes: [
          { id: '1', name: '主队', odds: 1.85, active: 1 },
          { id: '2', name: '客队', odds: 1.95, active: 1 },
        ],
      },
      {
        id: 602,
        product: 1,
        specifier_value: 'quarternr=2',
        timestamp: Date.now(),
        outcomes: [
          { id: '1', name: '主队', odds: 1.90, active: 1 },
          { id: '2', name: '客队', odds: 1.90, active: 1 },
        ],
      },
      {
        id: 603,
        product: 1,
        specifier_value: 'quarternr=3',
        timestamp: Date.now(),
        outcomes: [
          { id: '1', name: '主队', odds: 1.80, active: 1 },
          { id: '2', name: '客队', odds: 2.00, active: 1 },
        ],
      },
      {
        id: 604,
        product: 1,
        specifier_value: 'quarternr=4',
        timestamp: Date.now(),
        outcomes: [
          { id: '1', name: '主队', odds: 1.88, active: 1 },
          { id: '2', name: '客队', odds: 1.92, active: 1 },
        ],
      },
    ],
  },
  {
    id: 7,
    market_id: 224,
    match_id: 'sr:match:demo',
    groups: 'quarters',
    name: '单节大小分',
    specifiers: [
      {
        id: 701,
        product: 1,
        specifier_value: 'quarternr=1|total=52.5',
        timestamp: Date.now(),
        outcomes: [
          { id: 'over', name: '大于 52.5', odds: 1.90, active: 1 },
          { id: 'under', name: '小于 52.5', odds: 1.90, active: 1 },
        ],
      },
      {
        id: 702,
        product: 1,
        specifier_value: 'quarternr=2|total=54.5',
        timestamp: Date.now(),
        outcomes: [
          { id: 'over', name: '大于 54.5', odds: 1.85, active: 1 },
          { id: 'under', name: '小于 54.5', odds: 1.95, active: 1 },
        ],
      },
    ],
  },
  // 足球 - 角球
  {
    id: 8,
    market_id: 340,
    match_id: 'sr:match:demo',
    groups: 'corners',
    name: '角球大小',
    specifiers: [
      {
        id: 801,
        product: 3,
        specifier_value: 'total=9.5',
        timestamp: Date.now(),
        outcomes: [
          { id: 'over', name: '大于 9.5', odds: 1.88, active: 1 },
          { id: 'under', name: '小于 9.5', odds: 1.92, active: 1 },
        ],
      },
    ],
  },
  // 足球 - 上半场
  {
    id: 9,
    market_id: 37,
    match_id: 'sr:match:demo',
    groups: '1st_half',
    name: '上半场1X2',
    specifiers: [
      {
        id: 901,
        product: 1,
        specifier_value: '',
        timestamp: Date.now(),
        outcomes: [
          { id: '1', name: '主队胜', odds: 2.30, active: 1 },
          { id: 'X', name: '平局', odds: 2.10, active: 1 },
          { id: '2', name: '客队胜', odds: 3.80, active: 1 },
        ],
      },
    ],
  },
  {
    id: 10,
    market_id: 38,
    match_id: 'sr:match:demo',
    groups: '1st_half',
    name: '上半场大小球',
    specifiers: [
      {
        id: 1001,
        product: 1,
        specifier_value: 'total=1.5',
        timestamp: Date.now(),
        outcomes: [
          { id: 'over', name: '大于 1.5', odds: 2.05, active: 1 },
          { id: 'under', name: '小于 1.5', odds: 1.80, active: 1 },
        ],
      },
    ],
  },
];

export const MarketDemo: React.FC = () => {
  // 分类和分组盘口
  const classifiedMarkets = classifyMarkets(mockMarkets);
  const groupedMarkets = groupMarketsByTabChip(classifiedMarkets);

  const handleOutcomeClick = (marketId: number, specifierId: number, outcomeId: string | number) => {
    console.log('Outcome clicked:', { marketId, specifierId, outcomeId });
    alert(`已添加到投注单:\nMarket ID: ${marketId}\nSpecifier ID: ${specifierId}\nOutcome ID: ${outcomeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">盘口展示演示</h1>
          <p className="mt-2 text-sm text-gray-600">
            展示 Tab & Chip 两级分类系统的功能
          </p>
        </div>
      </div>

      {/* 盘口列表 */}
      <div className="max-w-7xl mx-auto">
        <MarketTabs
          groupedMarkets={groupedMarkets}
          onOutcomeClick={handleOutcomeClick}
        />
      </div>
    </div>
  );
};
