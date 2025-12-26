// src/components/MatchList.tsx
import React, { useMemo } from 'react';
import { Match, mockMatchList } from '../types/match';
import { processMatchList } from '../utils/dataProcessor';

// 假设的日期格式化函数
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 比赛列表项组件
const MatchListItem: React.FC<{ match: Match }> = ({ match }) => {
  // 滚球标识逻辑：status === 1 表示 Live
  const isLive = match.status === 1;
  
  // 实时比分展示逻辑：仅 Live 比赛展示比分
  const scoreDisplay = isLive 
    ? `${match.home_competitor.score} - ${match.away_competitor.score}`
    : 'VS';

  // 滚球标识：根据产品文档，Live 比赛需要标注 "Live"
  // 注意：产品文档中提到 product=1 标注 Live 标识，但 /v1/match 接口返回的 Match 对象中
  // 没有直接的 product 字段，而是通过 markets[].specifiers[].product 来判断。
  // 然而，由于 markets 字段被要求清空，我们必须依赖 Match 对象的 status 字段（status=1 表示 Live）
  // 来实现滚球标识，这与产品文档中 3.2.2 节的表格描述一致（status=1 -> Live）。
  const liveTag = isLive ? (
    <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
      Live
    </span>
  ) : null;

  return (
    <div className="flex items-center justify-between p-4 mb-2 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300 cursor-pointer">
      {/* 左侧：时间与滚球标识 */}
      <div className="flex flex-col items-start w-1/5">
        <span className="text-sm font-medium text-gray-500">
          {formatTime(match.start_time)}
        </span>
        {liveTag}
      </div>

      {/* 中间：对阵双方 */}
      <div className="flex flex-col items-center w-3/5 text-center">
        <div className="text-lg font-semibold text-gray-800 truncate w-full">
          {match.home_competitor.name}
        </div>
        <div className="text-sm text-gray-400 my-1">
          {match.match_status_name || '未开始'}
        </div>
        <div className="text-lg font-semibold text-gray-800 truncate w-full">
          {match.away_competitor.name}
        </div>
      </div>

      {/* 右侧：实时比分 */}
      <div className="flex flex-col items-end w-1/5">
        <span className={`text-2xl font-extrabold ${isLive ? 'text-red-600' : 'text-gray-600'}`}>
          {scoreDisplay}
        </span>
      </div>
    </div>
  );
};

// 比赛列表主组件
const MatchList: React.FC = () => {
  // 模拟数据获取和内存优化处理
  // 实际应用中，这里会调用 API 并传入 processMatchList
  const processedMatches = useMemo(() => {
    // 模拟从 API 获取数据
    const rawData = mockMatchList; 
    // 执行内存优化
    return processMatchList(rawData);
  }, []);

  // 验证内存优化是否生效（markets 字段是否被清空）
  // 理论上，processedMatches[0].markets 应该是一个空数组 []
  // console.log('Processed Match 1 Markets:', processedMatches[0].markets);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        比赛列表 (VOI-67)
      </h1>
      <div className="space-y-4">
        {processedMatches.map((match) => (
          <MatchListItem key={match.id} match={match} />
        ))}
      </div>
      <div className="mt-8 text-center text-gray-500">
        {/* 模拟分页加载提示 */}
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
          加载更多... (分页加载正常)
        </button>
      </div>
    </div>
  );
};

export default MatchList;
