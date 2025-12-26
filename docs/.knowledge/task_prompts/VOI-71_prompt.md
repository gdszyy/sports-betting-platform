# VOI-71: 投注单基础框架与模式切换

**推荐模型**: `manus-1.6-lite`  
**Linear Issue**: https://linear.app/voidzyy/issue/VOI-71  
**Git 分支**: `zhaoyiyinwinnie/voi-71-feature-投注单基础框架与模式切换`

---

## 任务提示词

```
你好！我需要你帮我完成一个体育博彩平台的前端开发任务。

## 项目信息

- **GitHub 仓库**: https://github.com/gdszyy/sports-betting-platform
- **Linear Issue**: VOI-71 - 投注单基础框架与模式切换
- **分支名称**: zhaoyiyinwinnie/voi-71-feature-投注单基础框架与模式切换

## 背景

这是一个体育博彩平台项目，目前需要实现投注单（Bet Slip）的基础框架。请先克隆仓库并查看以下文档：

1. `docs/design/前端产品交互文档.md` - 第 3.5 章节详细说明了投注单的交互需求
2. `README.md` - 项目整体说明

## 功能要求

### 1. 投注单基础框架

创建投注单容器组件，支持两种模式：
- **单关模式 (Single)**: 每个投注选项独立计算
- **串关模式 (Parlay)**: 多个选项组合成一个注单

### 2. 模式切换

在投注单顶部实现 Tab 切换：
- 两个 Tab: "单关" 和 "串关"
- 切换时保留已添加的投注选项
- 根据模式改变金额输入框的位置

### 3. 金额输入逻辑

- **单关模式**: 每个投注选项卡片都有独立的金额输入框
- **串关模式**: 所有选项下方只有一个全局金额输入框

## 技术栈

- **前端框架**: React 18 + TypeScript
- **样式**: TailwindCSS
- **状态管理**: Zustand
- **构建工具**: Vite

## 组件结构

请在 `frontend/src/components/BetSlip/` 目录下创建以下组件：

```
BetSlip/
├── index.tsx              # 主容器组件
├── BetSlipHeader.tsx      # 顶部（模式切换 Tab）
├── BetSlipItem.tsx        # 单个投注选项卡片
├── BetSlipFooter.tsx      # 底部（总金额、下注按钮）
└── useBetSlipStore.ts     # Zustand 状态管理
```

## 状态管理

使用 Zustand 创建 `useBetSlipStore`，需要管理：

```typescript
interface BetSlipStore {
  mode: 'single' | 'parlay';  // 当前模式
  selections: BetSelection[];  // 投注选项列表
  setMode: (mode: 'single' | 'parlay') => void;
  addSelection: (selection: BetSelection) => void;
  removeSelection: (id: string) => void;
  updateStake: (id: string, stake: number) => void;
  globalStake: number;  // 串关模式的全局金额
  setGlobalStake: (stake: number) => void;
}
```

## 验收标准

- [ ] 单关/串关模式切换正常
- [ ] 金额输入框位置和逻辑正确
- [ ] 投注选项可添加和移除
- [ ] 代码通过 TypeScript 类型检查
- [ ] 组件结构清晰，便于后续扩展

## 工作流程

1. 克隆仓库: `gh repo clone gdszyy/sports-betting-platform`
2. 创建并切换到指定分支
3. 阅读产品文档理解需求
4. 实现组件和状态管理
5. 测试功能
6. 提交代码并直接合并到 main 分支
7. 更新 Linear Issue 状态为 Done

**重要**: 不要创建 Pull Request，直接将代码合并到 main 分支。

请开始执行任务，有任何问题随时告诉我。
```

---

## 执行检查清单

- [ ] 仓库已克隆
- [ ] 分支已创建并切换
- [ ] 产品文档已阅读
- [ ] 组件已创建
- [ ] 状态管理已实现
- [ ] TypeScript 检查通过
- [ ] 代码已提交
- [ ] 代码已合并到 main 分支
- [ ] Linear Issue 已更新
