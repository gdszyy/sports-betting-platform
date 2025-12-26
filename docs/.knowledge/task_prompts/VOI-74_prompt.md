# VOI-74: 投注拒绝与打回处理

**推荐模型**: `manus-1.6-lite`  
**Linear Issue**: https://linear.app/voidzyy/issue/VOI-74  
**Git 分支**: `zhaoyiyinwinnie/voi-74-feature-投注拒绝与打回处理`  
**依赖任务**: VOI-71, VOI-72, VOI-73

---

## 任务提示词

```
你好！我需要你帮我完成投注拒绝与打回处理功能。

## 项目信息

- **GitHub 仓库**: https://github.com/gdszyy/sports-betting-platform
- **Linear Issue**: VOI-74 - 投注拒绝与打回处理
- **分支名称**: zhaoyiyinwinnie/voi-74-feature-投注拒绝与打回处理
- **依赖**: VOI-71, VOI-72, VOI-73 已完成

## 背景

当投注被服务器拒绝时，需要优雅地处理错误，并将注单返回到投注单中。请查看：

1. `docs/design/前端产品交互文档.md` - 第 3.5.6 章节
2. VOI-73 的投注提交逻辑

## 功能要求

### 1. 拒绝原因展示

在投注单顶部或悬浮窗内显示明确的拒绝原因：

| 拒绝原因 | 提示文案 |
| :--- | :--- |
| 赔率已变更 | "赔率已变更，投注失败。请确认新赔率后重新下注。" |
| 盘口已关闭 | "该盘口已关闭，无法投注。" |
| 余额不足 | "账户余额不足，请充值后重试。" |
| 系统错误 | "系统繁忙，请稍后重试。" |

### 2. 注单返回逻辑

失败的注单应自动返回到主投注单列表：
- 从 `pendingBets` 移除
- 添加回 `selections`
- 保留用户输入的金额
- 更新为最新的赔率

### 3. 视觉引导

返回的注单需要有明显的视觉效果：
- 高亮动画（例如：黄色闪烁 2 秒）
- 滚动到该注单位置
- 显示"已返回"标签

### 4. 冲突处理

如果返回的注单与投注单中已存在的选项冲突：
- 检测是否有相同的 `marketId` + `outcomeId`
- 如果冲突，自动合并：
  - 保留最新的赔率
  - 保留用户最后一次输入的金额
  - 不重复显示

### 5. 用户操作

返回后的注单允许：
- 修改金额
- 移除注单
- 提供"重试"快捷按钮（直接重新提交）

## 技术要点

### 1. 错误类型定义

```typescript
type BetRejectionReason = 
  | 'odds_changed'
  | 'market_closed'
  | 'insufficient_balance'
  | 'system_error';

interface BetRejection {
  selections: BetSelection[];
  reason: BetRejectionReason;
  message: string;
  timestamp: number;
}
```

### 2. 状态扩展

```typescript
interface BetSlipStore {
  // ... 原有字段
  rejections: BetRejection[];  // 拒绝记录
  
  handleRejection: (rejection: BetRejection) => void;
  returnToSlip: (selections: BetSelection[]) => void;
  retryBet: (selectionId: string) => void;
  dismissRejection: (timestamp: number) => void;
}
```

### 3. 返回动画

使用 Framer Motion 实现高亮效果：

```typescript
<motion.div
  initial={{ backgroundColor: '#fef3c7' }}
  animate={{ backgroundColor: '#ffffff' }}
  transition={{ duration: 2 }}
>
  <BetSlipItem selection={selection} />
</motion.div>
```

### 4. 冲突检测和合并

```typescript
const returnToSlip = (selections: BetSelection[]) => {
  selections.forEach(sel => {
    const existing = findSelection(sel.marketId, sel.outcomeId);
    
    if (existing) {
      // 合并：更新赔率和金额
      updateSelection(existing.id, {
        odds: sel.odds,
        stake: sel.stake || existing.stake
      });
    } else {
      // 新增
      addSelection(sel);
    }
  });
  
  // 滚动到第一个返回的注单
  scrollToSelection(selections[0].id);
};
```

### 5. 模拟拒绝（在 VOI-73 的提交逻辑中）

```typescript
const submitBet = async () => {
  // ... 等待逻辑
  
  // 模拟拒绝（30% 概率）
  const success = Math.random() > 0.3;
  
  if (!success) {
    const reasons: BetRejectionReason[] = [
      'odds_changed',
      'market_closed',
      'insufficient_balance',
      'system_error'
    ];
    
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    
    handleRejection({
      selections: currentSelections,
      reason,
      message: getRejectionMessage(reason),
      timestamp: Date.now()
    });
  }
};
```

## 验收标准

- [ ] 拒绝原因正确显示
- [ ] 注单正确返回到投注单
- [ ] 返回时有视觉引导效果
- [ ] 冲突注单正确合并
- [ ] 重试功能正常
- [ ] 代码通过 TypeScript 类型检查

## 工作流程

1. 克隆仓库并拉取最新代码
2. 创建并切换到指定分支
3. 基于 VOI-73 的代码进行扩展
4. 实现拒绝处理和返回逻辑
5. 测试各种拒绝场景
6. 提交代码并直接合并到 main 分支
7. 更新 Linear Issue 状态为 Done

**重要**: 不要创建 Pull Request，直接将代码合并到 main 分支。

请开始执行任务。
```

---

## 执行检查清单

- [ ] 依赖任务代码已审阅
- [ ] 分支已创建并切换
- [ ] 错误类型已定义
- [ ] 拒绝原因展示已实现
- [ ] 注单返回逻辑已实现
- [ ] 视觉引导已实现
- [ ] 冲突合并已实现
- [ ] 重试功能已实现
- [ ] 代码已提交
- [ ] 代码已合并到 main 分支
- [ ] Linear Issue 已更新
