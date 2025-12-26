/**
 * 比赛详情页面组件
 * 展示比赛信息和盘口列表
 */

import React, { useEffect, useState } from 'react';
import { Match, Market } from '../types/match';
import { fetchMatchDetail, fetchMatchMarkets } from '../services/apiService';
import { classifyMarkets, groupMarketsByTabChip, GroupedMarkets } from '../utils/marketClassifier';
import { MarketTabs } from './MarketTabs';

interface MatchDetailProps {
  matchId: string;
}

/**
 * 格式化时间戳为本地时间
 */
function formatMatchTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
}

/**
 * 获取比赛状态的显示文本和样式
 */
function getMatchStatusDisplay(status: number): { text: string; className: string } {
  switch (status) {
    case 0:
      return { text: '未开始', className: 'bg-gray-100 text-gray-800' };
    case 1:
      return { text: 'Live', className: 'bg-red-100 text-red-800' };
    case 2:
      return { text: '暂停', className: 'bg-yellow-100 text-yellow-800' };
    case 3:
      return { text: '已结束', className: 'bg-gray-100 text-gray-800' };
    case 4:
      return { text: '已关闭', className: 'bg-gray-100 text-gray-800' };
    case 5:
      return { text: '已取消', className: 'bg-red-100 text-red-800' };
    case 6:
      return { text: '延迟', className: 'bg-yellow-100 text-yellow-800' };
    case 7:
      return { text: '中断', className: 'bg-yellow-100 text-yellow-800' };
    case 8:
      return { text: '推迟', className: 'bg-yellow-100 text-yellow-800' };
    case 9:
      return { text: '弃赛', className: 'bg-red-100 text-red-800' };
    default:
      return { text: '未知', className: 'bg-gray-100 text-gray-800' };
  }
}

export const MatchDetail: React.FC<MatchDetailProps> = ({ matchId }) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [groupedMarkets, setGroupedMarkets] = useState<GroupedMarkets>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMatchData();
  }, [matchId]);

  const loadMatchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 并行加载比赛详情和盘口数据
      const [matchData, marketsData] = await Promise.all([
        fetchMatchDetail(matchId),
        fetchMatchMarkets(matchId),
      ]);

      setMatch(matchData);

      // 分类和分组盘口
      const classifiedMarkets = classifyMarkets(marketsData);
      const grouped = groupMarketsByTabChip(classifiedMarkets);
      setGroupedMarkets(grouped);
    } catch (err) {
      console.error('Error loading match data:', err);
      setError('加载比赛数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleOutcomeClick = (marketId: number, specifierId: number, outcomeId: string | number) => {
    console.log('Outcome clicked:', { marketId, specifierId, outcomeId });
    // TODO: 添加到投注单
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error || '未找到比赛数据'}</p>
          <button
            onClick={loadMatchData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  const statusDisplay = getMatchStatusDisplay(match.status);
  const isLive = match.status === 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 比赛头部信息 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* 比赛状态和时间 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.className}`}>
                {statusDisplay.text}
              </span>
              {!isLive && (
                <span className="text-sm text-gray-600">
                  {formatMatchTime(match.start_time)}
                </span>
              )}
            </div>
          </div>

          {/* 对阵信息 */}
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* 主队 */}
            <div className="text-center">
              {match.home_competitor.logo && (
                <img
                  src={match.home_competitor.logo}
                  alt={match.home_competitor.name}
                  className="w-16 h-16 mx-auto mb-2"
                />
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {match.home_competitor.name}
              </h2>
            </div>

            {/* 比分 */}
            <div className="text-center">
              {isLive && (
                <div className="text-4xl font-bold text-gray-900">
                  <span>{match.home_competitor.score}</span>
                  <span className="mx-2">-</span>
                  <span>{match.away_competitor.score}</span>
                </div>
              )}
              {!isLive && match.status === 0 && (
                <div className="text-2xl font-semibold text-gray-500">VS</div>
              )}
            </div>

            {/* 客队 */}
            <div className="text-center">
              {match.away_competitor.logo && (
                <img
                  src={match.away_competitor.logo}
                  alt={match.away_competitor.name}
                  className="w-16 h-16 mx-auto mb-2"
                />
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {match.away_competitor.name}
              </h2>
            </div>
          </div>
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
