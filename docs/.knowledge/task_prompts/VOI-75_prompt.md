# VOI-75: 高级过关功能 (Custom Bet + System Bet + Banker)

**推荐模型**: `manus-1.6` ⚠️ 复杂任务，使用标准模型  
**Linear Issue**: https://linear.app/voidzyy/issue/VOI-75  
**Git 分支**: `zhaoyiyinwinnie/voi-75-feature-高级过关功能-custom-bet-system-bet-banker`  
**依赖任务**: VOI-71, VOI-72

---

## 任务提示词

```
你好！我需要你帮我完成高级过关功能，这是一个复杂的业务逻辑任务。

## 项目信息

- **GitHub 仓库**: https://github.com/gdszyy/sports-betting-platform
- **Linear Issue**: VOI-75 - 高级过关功能
- **分支名称**: zhaoyiyinwinnie/voi-75-feature-高级过关功能-custom-bet-system-bet-banker
- **依赖**: VOI-71, VOI-72 已完成
- **推荐模型**: manus-1.6（复杂业务逻辑）

## 背景

这是一个复杂的过关投注功能，包含三个子功能：Custom Bet、System Bet 和 Banker。请仔细阅读：

1. `docs/design/前端产品交互文档.md` - 第 3.5.7 章节
2. VOI-71 的投注单基础框架代码

## 功能要求

### 1. Custom Bet (自定义投注)

**场景**: 用户希望将同一盘口的多个选项合并为一个逻辑整体（"或"关系）。

**示例**:
- 盘口: 比赛冠军
- 选项: A队、B队、C队
- 用户选择 A、B、C 三个选项
- 合并后: 只要 A、B、C 中任意一个获胜，这个 Way 就算赢

**实现要点**:
- 检测同一盘口的多个选项
- 在投注卡片上显示"合并选项"按钮
- 点击后，这些选项在视觉上合并为一个 Way
- 在过关计算中作为一个单位

```typescript
interface CustomBetWay {
  id: string;
  marketId: string;
  selections: BetSelection[];  // 同一盘口的多个选项
  combinedOdds: number;  // 组合赔率计算
}
```

### 2. System Bet (系统过关)

**场景**: 用户有多个选项，希望生成所有可能的组合方案。

**示例**:
- 用户选择了 4 个选项: A, B, C, D
- 系统过关方案:
  - 2/4: 从 4 个中选 2 个，共 C(4,2) = 6 注
    - AB, AC, AD, BC, BD, CD
  - 3/4: 从 4 个中选 3 个，共 C(4,3) = 4 注
    - ABC, ABD, ACD, BCD
  - 4/4: 全选，共 1 注
    - ABCD

**实现要点**:
- 当选项数量 ≥ 3 时，显示"系统过关" Tab
- 自动生成所有可能的方案
- 每种方案显示注数和可独立输入金额
- 实现组合数学计算 C(n,k)

```typescript
interface SystemBetScheme {
  id: string;
  name: string;  // 例如 "2/4"
  combinations: BetSelection[][];  // 所有组合
  totalBets: number;  // 总注数
  stake: number;  // 每注金额
  totalStake: number;  // 总金额
}

// 组合计算
const combination = (n: number, k: number): number => {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = result * (n - i + 1) / i;
  }
  return Math.round(result);
};

// 生成所有组合
const generateCombinations = (
  selections: BetSelection[],
  k: number
): BetSelection[][] => {
  const result: BetSelection[][] = [];
  
  const combine = (start: number, combo: BetSelection[]) => {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }
    
    for (let i = start; i < selections.length; i++) {
      combo.push(selections[i]);
      combine(i + 1, combo);
      combo.pop();
    }
  };
  
  combine(0, []);
  return result;
};
```

### 3. Banker (胆码)

**场景**: 在系统过关中，用户希望某些选项必须包含在所有组合中。

**示例**:
- 用户选择了 4 个选项: A, B, C, D
- 设置 A 为 Banker
- 系统过关 2/3（从 B, C, D 中选 2 个）:
  - A + BC
  - A + BD
  - A + CD

**实现要点**:
- 在系统过关模式下，每个选项卡片提供"设为胆码"开关
- 设定 Banker 后，重新计算组合
- Banker 必须包含在所有组合中

```typescript
interface BetSelection {
  // ... 原有字段
  isBanker: boolean;  // 是否为胆码
}

const generateSystemBetWithBanker = (
  selections: BetSelection[],
  k: number
): BetSelection[][] => {
  const bankers = selections.filter(s => s.isBanker);
  const normals = selections.filter(s => !s.isBanker);
  
  // 从非胆码中选择 k - bankers.length 个
  const normalCombos = generateCombinations(normals, k - bankers.length);
  
  // 每个组合都加上胆码
  return normalCombos.map(combo => [...bankers, ...combo]);
};
```

### 4. 赔率计算

**过关赔率**: 所有选项赔率相乘

```typescript
const calculateParlayOdds = (selections: BetSelection[]): number => {
  return selections.reduce((acc, sel) => acc * sel.odds, 1);
};

const calculatePotentialWin = (stake: number, odds: number): number => {
  return stake * odds;
};
```

## UI 设计

### 1. 模式切换

```
[单关] [串关] [系统过关]
```

- 单关: 默认模式
- 串关: 选项 ≥ 2 时可用
- 系统过关: 选项 ≥ 3 时可用

### 2. 系统过关界面

```
系统过关方案:

┌─────────────────────────────────────┐
│ 2/4 (6注)                           │
│ 金额: [____] 元/注                  │
│ 总金额: 60 元                       │
│ 最大赔付: 1,234.56 元               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 3/4 (4注)                           │
│ 金额: [____] 元/注                  │
│ 总金额: 40 元                       │
│ 最大赔付: 2,345.67 元               │
└─────────────────────────────────────┘
```

### 3. Banker 标识

```
┌─────────────────────────────────────┐
│ 曼城 vs 曼联 - 主胜              [B]│
│ 赔率: 1.85                          │
│ ✓ 设为胆码                          │
└─────────────────────────────────────┘
```

## 验收标准

- [ ] Custom Bet 合并选项功能正常
- [ ] System Bet 方案生成正确
- [ ] 组合数学计算准确
- [ ] Banker 功能正确影响组合
- [ ] 金额和赔付计算正确
- [ ] UI 交互流畅
- [ ] 代码通过 TypeScript 类型检查

## 工作流程

1. 克隆仓库并拉取最新代码
2. 创建并切换到指定分支
3. 仔细理解三个子功能的业务逻辑
4. 实现组合数学算法
5. 实现 UI 组件
6. 充分测试各种场景
7. 提交代码并创建 Pull Request
8. 更新 Linear Issue 状态为 Done

**注意**: 这是一个复杂任务，建议分步实现：
1. 先实现 System Bet 的基础功能
2. 再实现 Banker 功能
3. 最后实现 Custom Bet

请开始执行任务。
```

---

## 执行检查清单

- [ ] 依赖任务代码已审阅
- [ ] 分支已创建并切换
- [ ] 组合算法已实现
- [ ] Custom Bet 已实现
- [ ] System Bet 已实现
- [ ] Banker 已实现
- [ ] 赔率计算已实现
- [ ] UI 组件已创建
- [ ] 充分测试
- [ ] 代码已提交
- [ ] PR 已创建
- [ ] Linear Issue 已更新

---

## 测试用例

### 测试 1: System Bet 2/4
- 输入: 4 个选项，赔率分别为 1.5, 2.0, 1.8, 2.2
- 预期: 生成 6 注组合
- 验证: 每注赔率计算正确

### 测试 2: Banker + System Bet
- 输入: 4 个选项，A 为 Banker
- 方案: 2/3（从 B,C,D 中选 2）
- 预期: 生成 3 注，每注都包含 A

### 测试 3: Custom Bet
- 输入: 同一盘口的 3 个选项
- 操作: 点击"合并选项"
- 预期: 3 个选项合并为 1 个 Way
