# Agent 通用提示词库

**项目名称**: 体育博彩平台 (Sports Betting Platform)  
**版本**: 1.0  
**更新日期**: 2025-12-26

---

## 目录

1. [模型选择指南](#1-模型选择指南)
2. [项目级指令 (Project Instruction)](#2-项目级指令-project-instruction)
3. [任务级提示词模板](#3-任务级提示词模板)
4. [知识库注入模板](#4-知识库注入模板)
5. [交接文档更新协议](#5-交接文档更新协议)

---

## 1. 模型选择指南

### 模型能力与成本对照

| 模型 | 能力等级 | 适用场景 | 成本 |
| :--- | :--- | :--- | :--- |
| `manus-1.6-lite` | 基础 | 常规任务、单一功能、明确需求 | 低 |
| `manus-1.6` | 标准 | 拆解后仍复杂的任务、需要较强推理 | 中 |
| `manus-1.6-max` | 高级 | 无法解耦的复杂任务（谨慎使用） | 高 |

### 选择决策树

```
任务是否可以拆解为多个独立子任务？
├── 是 → 拆解后每个子任务用 manus-1.6-lite
└── 否 → 任务是否涉及复杂逻辑或多系统交互？
    ├── 否 → manus-1.6-lite
    └── 是 → 是否涉及架构设计或创新性解决方案？
        ├── 否 → manus-1.6
        └── 是 → manus-1.6-max（仅在必要时）
```

### 任务难度评估因子

| 因子 | 权重 | 说明 |
| :--- | :--- | :--- |
| 代码行数预估 | 20% | <100行=低, 100-500行=中, >500行=高 |
| 依赖系统数量 | 25% | 1个=低, 2-3个=中, >3个=高 |
| 业务逻辑复杂度 | 30% | 单一流程=低, 分支流程=中, 状态机=高 |
| 创新性要求 | 25% | 复用现有=低, 适配修改=中, 全新设计=高 |

---

## 2. 项目级指令 (Project Instruction)

以下指令将自动应用于项目下创建的所有任务：

```markdown
# 体育博彩平台 - 项目级指令

## 项目背景
你正在参与开发一个体育博彩平台的前端应用。项目采用 AI 驱动的开发模式，整合 GitHub、Linear 和 Railway。

## 核心约束

### 1. 内存管理
- `/v1/match` 接口返回的 `markets` 字段必须在获取后立即清空
- 盘口数据通过 `/v1/match/row/{match_id}` 按需加载

### 2. 滚球标识
- `product=1` 的盘口必须标注 "Live" 标识
- `product=3` 为赛前盘，默认展示

### 3. 盘口结构
- 每个 Market ID 对应一张盘口卡片
- 每个 Specifier 代表卡片中的一行
- Tab & Chip 分类遵循 Groups → Specifiers → Default 优先级

## 代码规范
- 使用 TypeScript 严格模式
- 组件采用函数式写法 + Hooks
- 样式使用 TailwindCSS
- 命名采用 camelCase（变量）和 PascalCase（组件）

## 提交规范
- feat: 新功能
- fix: 修复
- docs: 文档
- refactor: 重构
- test: 测试

## 完成标准
1. 代码通过 TypeScript 类型检查
2. 关键逻辑有单元测试
3. 更新交接文档 (HANDOVER_DOCUMENT.md)
4. 在 Linear 中更新任务状态
```

---

## 3. 任务级提示词模板

### 3.1 功能开发任务 (Feature)

```markdown
# 任务: {任务标题}

## Linear Issue
- ID: {VOI-XX}
- URL: {Linear URL}

## 任务描述
{从 Linear Issue 复制的描述}

## 技术上下文
{自动注入的知识库文档}

## 执行协议

### 第一步: 理解需求
1. 阅读任务描述和验收标准
2. 查阅相关知识库文档
3. 如有疑问，在 Linear Issue 中添加评论

### 第二步: 实现功能
1. 创建功能分支: `git checkout -b {gitBranchName}`
2. 编写代码，遵循项目代码规范
3. 编写必要的单元测试

### 第三步: 提交代码
1. 提交代码: `git commit -m "feat(VOI-XX): {简短描述}"`
2. 合并到 main 分支: `git checkout main && git merge {gitBranchName} --no-ff`
3. 推送到远程: `git push origin main`

### 第四步: 更新状态
1. 更新 Linear Issue 状态为 "Done"
2. 在 Linear Issue 中添加 commit SHA 作为附件
3. 更新交接文档中的进度

## 验收标准
{从 Linear Issue 复制的验收标准}
```

### 3.2 Bug 修复任务 (Fix)

```markdown
# 任务: 修复 {Bug 描述}

## Linear Issue
- ID: {VOI-XX}
- URL: {Linear URL}

## Bug 描述
{问题现象}

## 复现步骤
{复现步骤}

## 期望行为
{期望行为}

## 执行协议

### 第一步: 定位问题
1. 根据复现步骤确认问题
2. 分析代码定位根因
3. 记录问题原因

### 第二步: 修复问题
1. 创建修复分支: `git checkout -b fix/VOI-XX-{简短描述}`
2. 编写修复代码
3. 添加回归测试

### 第三步: 验证修复
1. 确认问题已修复
2. 确认没有引入新问题
3. 提交代码: `git commit -m "fix(VOI-XX): {简短描述}"`
4. 合并到 main 分支: `git checkout main && git merge {gitBranchName} --no-ff`
5. 推送到远程: `git push origin main`

### 第四步: 更新状态
1. 更新 Linear Issue 状态为 "Done"
2. 在 Linear Issue 中添加 commit SHA 和修复方案说明
```

### 3.3 文档任务 (Docs)

```markdown
# 任务: {文档标题}

## Linear Issue
- ID: {VOI-XX}
- URL: {Linear URL}

## 文档目标
{文档要达成的目标}

## 执行协议

### 第一步: 收集信息
1. 阅读相关代码和现有文档
2. 整理需要记录的内容

### 第二步: 撰写文档
1. 使用 Markdown 格式
2. 结构清晰，层次分明
3. 包含必要的代码示例

### 第三步: 提交文档
1. 提交到 `docs/` 目录
2. 更新 README 中的文档索引

## 文档规范
- 使用中文撰写
- 代码示例使用代码块
- 关键概念使用粗体标注
```

---

## 4. 知识库注入模板

任务创建时，根据任务类型自动注入相关知识库文档：

### 4.1 前端开发任务

```markdown
## 相关知识库文档

### API 文档
{自动注入 docs/api/ 下的相关文档}

### 设计文档
{自动注入 docs/design/ 下的相关文档}

### 分类规则
{自动注入 体育盘口Tab&Chip分类规则文档.md}
```

### 4.2 架构任务

```markdown
## 相关知识库文档

### 工作流程
{自动注入 创新工作流与核心理念.md}

### 架构图
{自动注入 04_triangle_architecture.mmd}

### API 集成
{自动注入 ManusAPI功能汇总文档.md}
```

---

## 5. 交接文档更新协议

每次任务完成后，必须更新交接文档：

```markdown
## 更新内容

### 1. 当前进度
- 将完成的任务从"进行中"移至"已完成"
- 添加下一个待开始的任务

### 2. 关键设计决策
- 如有新的设计决策，添加到相应章节
- 记录决策原因和影响

### 3. 已知问题与风险
- 如发现新问题，添加到"待解决问题"
- 如识别新风险，添加到"潜在风险"

### 4. 下一步行动
- 更新下一步行动列表
- 确保与 Linear Backlog 同步
```

---

## 附录: 常用命令速查

### Git 命令

```bash
# 创建功能分支
git checkout -b feature/VOI-XX-description

# 提交代码
git commit -m "feat(VOI-XX): description"

# 推送分支
git push origin feature/VOI-XX-description
```

### Linear 状态流转

```
Backlog → Todo → In Progress → In Review → Done
```

### 模型调用示例

```bash
# 使用 lite 模型
curl -X POST https://api.manus.ai/v1/tasks \
  -H "API_KEY: $MANUS_API_KEY" \
  -d '{"prompt": "...", "agentProfile": "manus-1.6-lite"}'

# 使用标准模型
curl -X POST https://api.manus.ai/v1/tasks \
  -H "API_KEY: $MANUS_API_KEY" \
  -d '{"prompt": "...", "agentProfile": "manus-1.6"}'
```
