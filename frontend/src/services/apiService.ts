/**
 * API 服务层
 * 处理所有与后端 API 的交互
 */

import { Match, Market } from '../types/match';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://xpbet-service-api.helix.city';

/**
 * 通用的 fetch 封装
 */
async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * 获取比赛详情
 */
export async function fetchMatchDetail(matchId: string): Promise<Match> {
  const response = await fetchAPI<{ code: string; data: Match; message: string }>(
    `/v1/match/${matchId}`
  );
  return response.data;
}

/**
 * 获取比赛的完整盘口数据
 * 这是盘口展示的主要数据源
 */
export async function fetchMatchMarkets(matchId: string): Promise<Market[]> {
  const response = await fetchAPI<{ code: string; data: Market[]; message: string }>(
    `/v1/match/row/${matchId}`
  );
  return response.data;
}

/**
 * 分页获取比赛盘口数据（可选）
 */
export interface MarketPaginationParams {
  cursor?: string;
  limit?: number;
}

export async function fetchMatchMarketsPaginated(
  matchId: string,
  params?: MarketPaginationParams
): Promise<{ markets: Market[]; next_cursor: string }> {
  const queryParams = new URLSearchParams();
  if (params?.cursor) queryParams.append('cursor', params.cursor);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  const queryString = queryParams.toString();
  const endpoint = `/v1/match/${matchId}/market${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetchAPI<{
    code: string;
    data: { list: Market[]; next_cursor: string };
    message: string;
  }>(endpoint);
  
  return {
    markets: response.data.list,
    next_cursor: response.data.next_cursor,
  };
}
