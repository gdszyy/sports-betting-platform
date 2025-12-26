# VOI-72: 投注单状态管理与UI展示

**推荐模型**: `manus-1.6-lite`  
**Linear Issue**: https://linear.app/voidzyy/issue/VOI-72  
**Git 分支**: `zhaoyiyinwinnie/voi-72-feature-投注单状态管理与ui展示`  
**依赖任务**: VOI-71 (需要先完成基础框架)

---

## 任务提示词

```
你好！我需要你帮我完成投注单状态管理与UI展示功能。

## 项目信息

- **GitHub 仓库**: https://github.com/gdszyy/sports-betting-platform
- **Linear Issue**: VOI-72 - 投注单状态管理与UI展示
- **分支名称**: zhaoyiyinwinnie/voi-72-feature-投注单状态管理与ui展示
- **依赖**: VOI-71 已完成（投注单基础框架）

## 背景

基于 VOI-71 已完成的投注单基础框架，现在需要实现各种状态的管理和对应的 UI 展示。请先查看：

1. `docs/design/前端产品交互文档.md` - 第 3.5.2 章节详细说明了状态展示需求
2. VOI-71 的代码实现（BetSlip 组件）

## 功能要求

### 1. 投注选项状态类型

需要实现以下状态的 UI 展示：

| 状态 | UI 表现 |
| :--- | :--- |
| **锁盘/失效** | 背景变灰，赔率消失，显示"已锁盘"或"已失效"图标，无法投注 |
| **串关冲突** | 同一比赛的多个盘口，提示"同一比赛的盘口无法串关"，禁用下注按钮 |
| **赔率变化** | 背景高亮（绿色代表升高，红色代表降低），持续 2-3 秒后恢复 |

### 2. 接受赔率变化设置

在投注单中添加一个全局设置，允许用户选择如何处理赔率变化：

- **不接受任何赔率变化**: 赔率有任何变动，投注都将被拒绝
- **接受任何赔率变化**: 无论赔率如何变动，都按最新赔率投注
- **只接受更高赔率**: 只有赔率升高或不变时才接受，降低则拒绝

设置可以用下拉菜单或选项按钮组实现。

### 3. 冲突检测逻辑

在串关模式下，需要检测：
- 如果用户添加了来自同一场比赛的多个盘口
- 检测到冲突时，在投注单顶部显示提示
- 禁用"下注"按钮

## 技术要点

### 1. 状态扩展

扩展 `useBetSlipStore` 添加状态字段：

```typescript
interface BetSelection {
  id: string;
  matchId: string;  // 用于冲突检测
  marketId: string;
  odds: number;
  status: 'active' | 'suspended' | 'locked';  // 选项状态
  previousOdds?: number;  // 用于检测赔率变化
}

interface BetSlipStore {
  // ... 原有字段
  oddsChangePolicy: 'none' | 'any' | 'higher';  // 赔率变化策略
  setOddsChangePolicy: (policy: string) => void;
  hasConflict: () => boolean;  // 检测串关冲突
}
```

### 2. 动画效果

使用 Framer Motion 实现赔率变化动画：

```typescript
import { motion } from 'framer-motion';

// 赔率变化时的动画
<motion.div
  animate={{
    backgroundColor: oddsIncreased ? '#10b981' : '#ef4444'
  }}
  transition={{ duration: 0.3 }}
>
  {odds}
</motion.div>
```

### 3. 冲突检测

```typescript
const hasConflict = () => {
  if (mode !== 'parlay') return false;
  
  const matchIds = selections.map(s => s.matchId);
  const uniqueMatchIds = new Set(matchIds);
  
  return matchIds.length !== uniqueMatchIds.size;
};
```

## 验收标准

- [ ] 锁盘/失效状态正确显示
- [ ] 串关冲突检测和提示正常
- [ ] 赔率变化动画效果流畅
- [ ] 接受赔率变化设置可用
- [ ] 代码通过 TypeScript 类型检查

## 工作流程

1. 克隆仓库并拉取最新代码
2. 创建并切换到指定分支
3. 基于 VOI-71 的代码进行扩展
4. 实现状态管理和 UI 展示
5. 测试各种状态切换
6. 提交代码并直接合并到 main 分支
7. 更新 Linear Issue 状态为 Done

**重要**: 不要创建 Pull Request，直接将代码合并到 main 分支。

请开始执行任务。
```

---

## 执行检查清单

- [ ] VOI-71 代码已审阅
- [ ] 分支已创建并切换
- [ ] 状态类型已扩展
- [ ] UI 状态展示已实现
- [ ] 动画效果已实现
- [ ] 冲突检测已实现
- [ ] 赔率变化设置已实现
- [ ] 代码已提交
- [ ] 代码已合并到 main 分支
- [ ] Linear Issue 已更新
