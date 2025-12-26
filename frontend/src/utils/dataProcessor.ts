// src/utils/dataProcessor.ts
import { Match } from '../types/match';

/**
 * 处理比赛列表数据，执行关键的内存优化操作：清空 markets 字段。
 * @param matches 原始比赛列表数据
 * @returns 经过内存优化处理后的比赛列表
 */
export const processMatchList = (matches: Match[]): Match[] => {
  // 关键约束 1: 内存管理 - /v1/match 接口返回的 markets 字段必须在获取后立即清空
  const processedMatches = matches.map(match => {
    // 创建一个浅拷贝以避免直接修改原始数据（尽管在实际应用中，这可能发生在API层）
    const processedMatch = { ...match };
    
    // 清空 markets 字段以释放内存
    // 注意：在 TypeScript 中，如果 Match 接口定义了 markets: Market[]，
    // 理论上清空后应该是一个空数组。
    processedMatch.markets = [];
    
    // 假设我们在这里可以进行其他必要的预处理，例如检查滚球标识
    // 虽然 markets 被清空，但我们依赖 match.status 来判断滚球状态
    // status: 1 (live)
    
    return processedMatch;
  });

  // 理论上，这里可以手动触发垃圾回收，但在JS环境中通常不可行，
  // 只能依赖清空引用来让GC自动处理。
  // console.log('Markets field cleared for memory optimization.');

  return processedMatches;
};
