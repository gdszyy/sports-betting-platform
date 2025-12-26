// src/types/match.ts

/**
 * 比赛列表接口返回的单个比赛对象
 */
export interface Match {
  id: number;
  match_id: string;
  sport_id: string;
  category_id: string;
  tournament_id: string;
  start_time: number; // Unix timestamp in seconds
  match_phase: number;
  status: number; // 0: Not Started, 1: Live, 3: Ended, etc.
  match_status: number;
  match_status_name: string;
  home_competitor: Competitor;
  away_competitor: Competitor;
  markets: Market[]; // 必须在获取后立即清空以释放内存
}

/**
 * 队伍信息
 */
export interface Competitor {
  id: number;
  competitor_id: string;
  logo: string;
  name: string;
  score: number;
}

/**
 * 盘口结果 (Outcome)
 */
export interface Outcome {
  id: number | string;
  name: string;
  odds: number;
  active: number;
}

/**
 * 盘口细节 (Specifier)
 */
export interface Specifier {
  id: number;
  product: number; // 1: 滚球盘 (Live Odds), 3: 赛前盘 (Pre-match Odds)
  specifier_value: string;
  specifier_status?: number;
  timestamp: number;
  outcomes: Outcome[];
}

/**
 * 盘口 (Market)
 */
export interface Market {
  id: number;
  market_id: number;
  match_id: string;
  groups: string;
  name: string;
  specifiers: Specifier[];
}

/**
 * /v1/match 接口的完整响应结构
 */
export interface MatchListResponse {
  code: string;
  data: {
    next_cursor: string;
    list: Match[];
  };
  message: string;
}

// 模拟数据
export const mockMatchList: Match[] = [
  {
    id: 1001,
    match_id: "sr:match:live-1",
    sport_id: "sr:sport:1",
    category_id: "sr:category:1",
    tournament_id: "sr:tournament:1",
    start_time: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago (Live)
    match_phase: 1,
    status: 1, // Live
    match_status: 1,
    match_status_name: "Live",
    home_competitor: {
      id: 1,
      competitor_id: "sr:comp:1",
      logo: "",
      name: "曼城",
      score: 2,
    },
    away_competitor: {
      id: 2,
      competitor_id: "sr:comp:2",
      logo: "",
      name: "利物浦",
      score: 1,
    },
    markets: [
      {
        id: 1,
        market_id: 1,
        match_id: "sr:match:live-1",
        groups: "all",
        name: "1x2",
        specifiers: [
          {
            id: 101,
            product: 1, // Live Market
            specifier_value: "",
            timestamp: Date.now(),
            outcomes: [
              { id: "1", name: "曼城", odds: 1.5, active: 1 },
              { id: "2", name: "平局", odds: 4.0, active: 1 },
              { id: "3", name: "利物浦", odds: 6.5, active: 1 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 1002,
    match_id: "sr:match:pre-2",
    sport_id: "sr:sport:1",
    category_id: "sr:category:1",
    tournament_id: "sr:tournament:1",
    start_time: Math.floor(Date.now() / 1000) + 86400, // Tomorrow (Pre-match)
    match_phase: 0,
    status: 0, // Not Started
    match_status: 0,
    match_status_name: "Not started",
    home_competitor: {
      id: 3,
      competitor_id: "sr:comp:3",
      logo: "",
      name: "皇家马德里",
      score: 0,
    },
    away_competitor: {
      id: 4,
      competitor_id: "sr:comp:4",
      logo: "",
      name: "巴塞罗那",
      score: 0,
    },
    markets: [
      {
        id: 2,
        market_id: 1,
        match_id: "sr:match:pre-2",
        groups: "all",
        name: "1x2",
        specifiers: [
          {
            id: 201,
            product: 3, // Pre-match Market
            specifier_value: "",
            timestamp: Date.now(),
            outcomes: [
              { id: "1", name: "皇马", odds: 2.1, active: 1 },
              { id: "2", name: "平局", odds: 3.5, active: 1 },
              { id: "3", name: "巴萨", odds: 3.0, active: 1 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 1003,
    match_id: "sr:match:ended-3",
    sport_id: "sr:sport:2",
    category_id: "sr:category:2",
    tournament_id: "sr:tournament:2",
    start_time: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago (Ended)
    match_phase: 3,
    status: 3, // Ended
    match_status: 3,
    match_status_name: "Ended",
    home_competitor: {
      id: 5,
      competitor_id: "sr:comp:5",
      logo: "",
      name: "湖人",
      score: 110,
    },
    away_competitor: {
      id: 6,
      competitor_id: "sr:comp:6",
      logo: "",
      name: "凯尔特人",
      score: 108,
    },
    markets: [], // 模拟已清空
  },
];
