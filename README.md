# 体育博彩平台 (Sports Betting Platform)

## 项目概述

本项目是一个基于 AI 驱动的体育博彩平台，采用 **Manus Agent 协作体系** 进行项目管理和开发。项目整合了 GitHub（硬记忆）、Linear（信息中枢）和 Railway（实时部署）三大核心组件，实现了从任务分派到代码交付的全流程自动化。

## 核心架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Human (目标函数)                          │
│              Review Delivery ←→ Iterate & Feedback          │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│  GitHub (硬记忆)    │  Linear (信息中枢)  │  Railway (部署)  │
│  - Repository       │  - Backlog          │  - Auto Deploy   │
│  - Knowledge Base   │  - In Progress      │  - Live Preview  │
│  - Deliverables     │  - Done             │                  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│              Manus Agent (执行者)                            │
│        Manager Agent → Executor Agent → Commit & PR         │
└─────────────────────────────────────────────────────────────┘
```

## 项目结构

```
sports-betting-platform/
├── README.md                    # 项目说明
├── docs/
│   ├── .knowledge/              # 知识库（Agent上下文注入）
│   │   ├── HANDOVER_DOCUMENT.md # 交接文档（会话持久化）
│   │   └── ...
│   ├── api/                     # API文档
│   └── design/                  # 设计文档
├── scripts/                     # 自动化脚本
│   └── manus_task_dispatcher.py # 任务分派脚本
└── src/                         # 源代码
```

## 工作流程

### 1. 任务分派流程

1. **Linear Backlog** → Manager Agent 拉取待办任务
2. **难度评估** → 根据多因子算法计算任务难度
3. **模型选择** → 匹配最优 Manus Agent 模型
   - `manus-1.6-lite`: 常规任务（优先使用）
   - `manus-1.6`: 拆解后仍复杂的任务
   - `manus-1.6-max`: 无法解耦的复杂任务（谨慎使用）
4. **上下文注入** → 自动从知识库检索相关文档
5. **任务执行** → Executor Agent 开发并提交 PR

### 2. 人在回路的梯度下降

- **Agent 即"模型"**: 每次代码提交是对目标的一次梯度下降尝试
- **人即"目标函数"**: PR 审核和反馈提供优化梯度
- **知识库即"权重"**: 固化项目核心设计和最佳实践
- **交接文档即"会话持久化"**: 确保上下文无损传递

## 模型选择策略

| 任务类型 | 推荐模型 | 说明 |
| :--- | :--- | :--- |
| 常规开发任务 | `manus-1.6-lite` | 单一功能、明确需求 |
| 复杂任务（可拆解） | 拆解后用 `lite` | 先分解再执行 |
| 复杂任务（拆解后仍复杂） | `manus-1.6` | 需要更强推理能力 |
| 无法解耦的复杂任务 | `manus-1.6-max` | 仅在必要时使用 |

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/gdszyy/sports-betting-platform.git

# 进入项目目录
cd sports-betting-platform

# 查看知识库文档
cat docs/.knowledge/HANDOVER_DOCUMENT.md
```

## 相关链接

- [GitHub Repository](https://github.com/gdszyy/sports-betting-platform)
- [Linear Project](#) (待配置)
- [Railway Deployment](#) (待配置)

## License

MIT License
