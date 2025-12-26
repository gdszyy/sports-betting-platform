# 贡献指南 (Contributing Guide)

感谢您对体育博彩平台项目的关注！本文档将指导您如何参与项目开发。

## 开发流程

### 1. 任务认领

1. 访问 [Linear Project](https://linear.app/voidzyy/project/sports-betting-platform-b6c75c6e7fb5)
2. 在 Backlog 中选择一个任务
3. 将任务状态更新为 "In Progress"
4. 将任务分配给自己

### 2. 分支管理

```bash
# 从 main 分支创建功能分支
git checkout main
git pull origin main
git checkout -b feature/VOI-XX-description

# 或使用 Linear 提供的分支名
git checkout -b {gitBranchName}
```

### 3. 代码规范

#### TypeScript

- 使用严格模式 (`strict: true`)
- 所有函数参数和返回值必须有类型注解
- 避免使用 `any` 类型

#### React 组件

```tsx
// 推荐: 函数式组件 + TypeScript
interface Props {
  title: string;
  onClick: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};
```

#### 样式

- 使用 TailwindCSS 工具类
- 避免内联样式
- 复杂样式可提取为组件

### 4. 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能
git commit -m "feat(VOI-XX): 添加比赛导航功能"

# 修复
git commit -m "fix(VOI-XX): 修复赔率显示错误"

# 文档
git commit -m "docs(VOI-XX): 更新API文档"

# 重构
git commit -m "refactor(VOI-XX): 重构盘口分类逻辑"

# 测试
git commit -m "test(VOI-XX): 添加单元测试"
```

### 5. Pull Request

1. 推送分支到远程仓库
   ```bash
   git push origin feature/VOI-XX-description
   ```

2. 创建 Pull Request
   - 标题: `[VOI-XX] 功能描述`
   - 描述: 包含任务链接和变更说明
   - 关联 Linear Issue

3. 等待代码审查

### 6. 完成任务

1. PR 合并后，更新 Linear 任务状态为 "Done"
2. 更新 `HANDOVER_DOCUMENT.md` 中的进度
3. 删除本地和远程功能分支

## 模型选择指南

### 何时使用 `manus-1.6-lite`

- 单一功能开发
- 明确的需求和验收标准
- 不涉及复杂业务逻辑
- 代码量 < 200 行

### 何时使用 `manus-1.6`

- 涉及多个模块交互
- 需要理解复杂业务逻辑
- 拆解后仍有一定复杂度
- 代码量 200-500 行

### 何时使用 `manus-1.6-max`

- 无法拆解的复杂任务
- 需要架构设计或创新方案
- 涉及多系统集成
- **谨慎使用，控制成本**

## 知识库维护

### 添加新文档

1. 将文档放入 `docs/.knowledge/` 目录
2. 使用 Markdown 格式
3. 在 `HANDOVER_DOCUMENT.md` 中添加引用

### 更新交接文档

每次任务完成后，必须更新 `HANDOVER_DOCUMENT.md`：

1. 更新"当前进度"章节
2. 记录新的设计决策
3. 添加已知问题（如有）
4. 更新下一步行动

## 问题反馈

如遇到问题，请：

1. 在 Linear 中创建 Issue
2. 详细描述问题和复现步骤
3. 附上相关日志或截图

## 相关链接

- [GitHub Repository](https://github.com/gdszyy/sports-betting-platform)
- [Linear Project](https://linear.app/voidzyy/project/sports-betting-platform-b6c75c6e7fb5)
- [知识库文档](docs/.knowledge/)
