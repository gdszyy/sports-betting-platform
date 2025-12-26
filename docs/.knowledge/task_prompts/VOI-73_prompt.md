# VOI-73: 投注生命周期与等待处理

**推荐模型**: `manus-1.6-lite`  
**Linear Issue**: https://linear.app/voidzyy/issue/VOI-73  
**Git 分支**: `zhaoyiyinwinnie/voi-73-feature-投注生命周期与等待处理`  
**依赖任务**: VOI-71, VOI-72

---

## 任务提示词

```
你好！我需要你帮我完成投注生命周期与等待处理功能。

## 项目信息

- **GitHub 仓库**: https://github.com/gdszyy/sports-betting-platform
- **Linear Issue**: VOI-73 - 投注生命周期与等待处理
- **分支名称**: zhaoyiyinwinnie/voi-73-feature-投注生命周期与等待处理
- **依赖**: VOI-71, VOI-72 已完成

## 背景

用户点击"下注"按钮后，需要模拟服务器处理延迟，并在等待期间提供良好的用户体验。请查看：

1. `docs/design/前端产品交互文档.md` - 第 3.5.5 章节
2. VOI-71 和 VOI-72 的代码实现

## 功能要求

### 1. 等待时间模拟

根据盘口类型设置不同的等待时间：
- **赛前盘**: 随机 0-3 秒
- **滚球盘**: 随机 0-16 秒

```typescript
const getWaitTime = (product: number) => {
  if (product === 1) {
    // 滚球盘
    return Math.random() * 16000;
  } else {
    // 赛前盘
    return Math.random() * 3000;
  }
};
```

### 2. 投注中状态

用户点击"下注"后：
- 投注单**可以继续添加新盘口**
- "下注"按钮变为全局禁用状态，防止重复提交
- 已提交的注单显示加载动画
- 已提交的注单**无法修改金额或移除**

### 3. 悬浮窗设计

为了不阻塞用户继续添加新盘口，将"投注中"的注单移至侧边悬浮窗：

- 悬浮窗默认收起，仅显示"投注中..."文字和加载动画
- 用户悬浮或点击时，展开显示正在处理中的注单卡片列表
- 悬浮窗位置：右侧边缘，固定定位

### 4. 状态机设计

实现投注状态机：

```
idle (空闲)
  ↓ 用户点击"下注"
submitting (提交中)
  ↓ 请求发送
pending (等待处理)
  ↓ 服务器响应
success (成功) / failed (失败)
```

## 技术要点

### 1. 状态扩展

```typescript
interface BetSlipStore {
  // ... 原有字段
  pendingBets: BetSelection[];  // 投注中的注单
  isSubmitting: boolean;  // 是否有注单正在提交
  
  submitBet: () => Promise<void>;
  moveToPending: (selections: BetSelection[]) => void;
  removePending: (id: string) => void;
}
```

### 2. 悬浮窗组件

创建 `BetSlipPendingDrawer.tsx`:

```typescript
interface PendingDrawerProps {
  pendingBets: BetSelection[];
  isOpen: boolean;
  onToggle: () => void;
}
```

### 3. 模拟投注请求

```typescript
const submitBet = async () => {
  const currentSelections = [...selections];
  
  // 移至 pending 状态
  moveToPending(currentSelections);
  
  // 清空当前投注单
  clearSelections();
  
  // 模拟等待
  const waitTime = getWaitTime(currentSelections[0].product);
  await new Promise(resolve => setTimeout(resolve, waitTime));
  
  // 模拟结果（70% 成功，30% 失败）
  const success = Math.random() > 0.3;
  
  if (success) {
    // 成功：从 pending 中移除
    removePending(currentSelections[0].id);
    showSuccessToast();
  } else {
    // 失败：返回到投注单（VOI-74 处理）
    returnToSlip(currentSelections);
  }
};
```

## 验收标准

- [ ] 等待时间根据盘口类型正确设置
- [ ] 投注中状态 UI 正确显示
- [ ] 悬浮窗交互正常
- [ ] 投注中可继续添加新盘口
- [ ] 状态机流转正确
- [ ] 代码通过 TypeScript 类型检查

## 工作流程

1. 克隆仓库并拉取最新代码
2. 创建并切换到指定分支
3. 基于 VOI-71 和 VOI-72 的代码进行扩展
4. 实现状态机和悬浮窗
5. 测试投注流程
6. 提交代码并创建 Pull Request
7. 更新 Linear Issue 状态为 Done

请开始执行任务。
```

---

## 执行检查清单

- [ ] 依赖任务代码已审阅
- [ ] 分支已创建并切换
- [ ] 状态机已实现
- [ ] 悬浮窗组件已创建
- [ ] 等待时间逻辑已实现
- [ ] 投注中状态已实现
- [ ] 代码已提交
- [ ] PR 已创建
- [ ] Linear Issue 已更新
