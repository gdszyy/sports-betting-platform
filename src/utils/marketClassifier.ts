/**
 * 盘口分类工具 - Tab & Chip 分类算法
 * 根据《体育盘口Tab&Chip分类规则文档》实现
 */

import { Market } from '../types/match';

/**
 * Groups 到 Tab 的映射表
 */
const GROUP_TO_TAB: Record<string, string> = {
  regular_play: '流行',
  score: '进球',
  goals: '进球',
  statistics: '统计信息',
  player_props: '球员',
  scorers: '射手',
  corners: '角球',
  bookings: '黄牌',
  overtime: '加时',
  combo: '组合',
  player_points: '玩家积分',
  '3_pointers': '3分',
  three_point: '3分',
  assists: '关键传球',
  steals: '抢断',
  alternative: '替代',
  specials: '特别',
  handicap: '残疾',
  '1st_half': '上半场',
  '2nd_half': '下半场',
  quarters: '四分之一决赛',
  innings: '局/局数',
  sets: '盘/盘数',
  maps: '地图',
  periods: '节/节数',
  frames: '局',
  overs: '轮',
  drives: '进攻',
};

/**
 * Specifier 关键字到 Tab 的映射表
 */
const SPECIFIER_TO_TAB: Record<string, string> = {
  inningnr: '局/局数',
  setnr: '盘/盘数',
  mapnr: '地图',
  quarternr: '四分之一决赛',
  periodnr: '节/节数',
  framenr: '局',
  overnr: '轮',
  drivenr: '进攻',
};

/**
 * Tab 到主 Specifier 的映射表
 */
const TAB_TO_PRIMARY_SPECIFIER: Record<string, string> = {
  '局/局数': 'inningnr',
  '盘/盘数': 'setnr',
  '地图': 'mapnr',
  '四分之一决赛': 'quarternr',
  '节/节数': 'periodnr',
  '局': 'framenr',
  '轮': 'overnr',
  '进攻': 'drivenr',
  '上半场': 'goalnr',
  '下半场': 'goalnr',
  '角球': 'cornernr',
};

/**
 * 扩展的 Market 接口，包含分类信息
 */
export interface ClassifiedMarket extends Market {
  tab_id: string;
  chip_id: string;
}

/**
 * 确定盘口的 Tab ID
 * 优先级：Groups > Specifiers > Default
 */
export function determineTabId(groups: string, specifiers: any[]): string {
  // 优先级 1: 基于 groups 分配
  if (groups) {
    const groupList = groups.split('|');
    for (const g of groupList) {
      const trimmedGroup = g.trim();
      if (GROUP_TO_TAB[trimmedGroup]) {
        return GROUP_TO_TAB[trimmedGroup];
      }
    }
  }

  // 优先级 2: 基于 specifiers 分配
  if (specifiers && specifiers.length > 0) {
    // 检查 specifiers 数组中是否包含特定关键字
    for (const spec of specifiers) {
      if (spec.specifier_value) {
        for (const [specKey, tabId] of Object.entries(SPECIFIER_TO_TAB)) {
          if (spec.specifier_value.includes(specKey)) {
            return tabId;
          }
        }
      }
    }
  }

  // 优先级 3: 默认分配
  return '流行';
}

/**
 * 从 specifier_value 字符串中提取指定键的值
 * 格式: "quarternr=1" 或 "total=2.5|hcp=-1.5"
 */
function extractSpecifierValue(specifierValue: string, key: string): string | null {
  if (!specifierValue) return null;

  const regex = new RegExp(`${key}=([^|,]*)`);
  const match = specifierValue.match(regex);
  return match && match[1] ? match[1] : null;
}

/**
 * 确定盘口的 Chip ID
 */
export function determineChipId(tabId: string, specifierValue: string): string {
  const primarySpec = TAB_TO_PRIMARY_SPECIFIER[tabId];
  if (!primarySpec) return '';

  const value = extractSpecifierValue(specifierValue, primarySpec);
  if (value) {
    return `${tabId}_${primarySpec}_${value}`;
  }

  return '';
}

/**
 * 为盘口分配 Tab 和 Chip
 */
export function classifyMarket(market: Market): ClassifiedMarket {
  const tab_id = determineTabId(market.groups, market.specifiers);
  
  // 对于每个 specifier，生成对应的 chip_id
  // 注意：一个 market 可能有多个 specifiers，这里我们取第一个有效的 chip_id
  let chip_id = '';
  for (const spec of market.specifiers) {
    const chipId = determineChipId(tab_id, spec.specifier_value);
    if (chipId) {
      chip_id = chipId;
      break;
    }
  }

  return {
    ...market,
    tab_id,
    chip_id,
  };
}

/**
 * 批量分类盘口
 */
export function classifyMarkets(markets: Market[]): ClassifiedMarket[] {
  return markets.map(classifyMarket);
}

/**
 * 按 Tab 和 Chip 分组盘口
 */
export interface GroupedMarkets {
  [tabId: string]: {
    [chipId: string]: ClassifiedMarket[];
  };
}

export function groupMarketsByTabChip(markets: ClassifiedMarket[]): GroupedMarkets {
  const grouped: GroupedMarkets = {};

  for (const market of markets) {
    if (!grouped[market.tab_id]) {
      grouped[market.tab_id] = {};
    }

    const chipKey = market.chip_id || 'default';
    if (!grouped[market.tab_id][chipKey]) {
      grouped[market.tab_id][chipKey] = [];
    }

    grouped[market.tab_id][chipKey].push(market);
  }

  return grouped;
}

/**
 * 获取 Tab 列表（按优先级排序）
 */
export function getTabList(groupedMarkets: GroupedMarkets): string[] {
  const tabs = Object.keys(groupedMarkets);
  
  // 定义 Tab 的优先级顺序
  const tabPriority: Record<string, number> = {
    '流行': 1,
    '进球': 2,
    '统计信息': 3,
    '球员': 4,
    '射手': 5,
    '角球': 6,
    '黄牌': 7,
    '加时': 8,
    '组合': 9,
    '上半场': 10,
    '下半场': 11,
    '玩家积分': 12,
    '3分': 13,
    '关键传球': 14,
    '抢断': 15,
    '替代': 16,
    '特别': 17,
    '残疾': 18,
    '四分之一决赛': 19,
  };

  return tabs.sort((a, b) => {
    const priorityA = tabPriority[a] || 999;
    const priorityB = tabPriority[b] || 999;
    return priorityA - priorityB;
  });
}

/**
 * 获取指定 Tab 下的 Chip 列表
 */
export function getChipList(groupedMarkets: GroupedMarkets, tabId: string): string[] {
  if (!groupedMarkets[tabId]) return [];
  
  const chips = Object.keys(groupedMarkets[tabId]);
  
  // 过滤掉 'default' 并排序
  return chips
    .filter(chip => chip !== 'default')
    .sort((a, b) => {
      // 尝试提取数字进行排序（如 "四分之一决赛_quarternr_1"）
      const numA = parseInt(a.split('_').pop() || '0');
      const numB = parseInt(b.split('_').pop() || '0');
      return numA - numB;
    });
}

/**
 * 格式化 Chip 显示名称
 */
export function formatChipLabel(chipId: string): string {
  if (!chipId || chipId === 'default') return '';
  
  const parts = chipId.split('_');
  if (parts.length < 3) return chipId;
  
  const specifierName = parts[1];
  const value = parts[2];
  
  // 根据 specifier 类型格式化显示
  const formatMap: Record<string, (v: string) => string> = {
    quarternr: (v) => `第${v}节`,
    periodnr: (v) => `第${v}节`,
    inningnr: (v) => `第${v}局`,
    setnr: (v) => `第${v}盘`,
    mapnr: (v) => `地图${v}`,
    framenr: (v) => `第${v}局`,
    overnr: (v) => `第${v}轮`,
    drivenr: (v) => `第${v}次进攻`,
    goalnr: (v) => `第${v}球`,
    cornernr: (v) => `第${v}个角球`,
  };
  
  const formatter = formatMap[specifierName];
  return formatter ? formatter(value) : `${specifierName}=${value}`;
}
