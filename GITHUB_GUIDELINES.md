# GitHub 项目规范

**版本**: 1.0  
**更新日期**: 2025-12-26  
**适用范围**: Sports Betting Platform 项目

---

## 一、核心原则

本项目采用 **Linear 为唯一任务状态管理中心** 的协作模式，GitHub 仅作为代码托管和版本控制平台。

### 关键规则

1. ✅ **任务状态仅在 Linear 中维护**
2. ✅ **GitHub 仅记录代码交付信息**
3. ✅ **通过 PR 关联 Linear Issue，但不在 GitHub 中维护任务状态**

---

## 二、分支管理规范

### 2.1 分支命名规范

所有功能分支必须遵循以下命名格式：

```
{github_username}/{linear_issue_id}-{brief_description}
```

**示例**：
```
zhaoyiyinwinnie/voi-71-feature-投注单基础框架与模式切换
zhaoyiyinwinnie/voi-68-feature-盘口展示与tabchip分类
```

### 2.2 分支类型

| 分支类型 | 命名前缀 | 说明 |
| :--- | :--- | :--- |
| 功能分支 | `{username}/voi-{number}-feature-{desc}` | 新功能开发 |
| 修复分支 | `{username}/voi-{number}-fix-{desc}` | Bug 修复 |
| 重构分支 | `{username}/voi-{number}-refactor-{desc}` | 代码重构 |
| 文档分支 | `{username}/voi-{number}-docs-{desc}` | 文档更新 |

### 2.3 主分支保护

- `main` 分支为受保护分支
- 所有代码必须通过 Pull Request 合并
- 合并后自动删除功能分支

---

## 三、提交信息规范

### 3.1 提交信息格式

```
<type>(<scope>): <subject> [<linear-issue-id>]

<body>

<footer>
```

### 3.2 类型（Type）

| 类型 | 说明 |
| :--- | :--- |
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响功能） |
| `refactor` | 代码重构 |
| `test` | 测试相关 |
| `chore` | 构建工具、依赖更新等 |

### 3.3 提交示例

**功能提交**：
```
feat(betslip): 实现投注单基础框架与模式切换 [VOI-71]

- 实现单关/串关模式切换
- 添加 Zustand 状态管理
- 创建 BetSlip 组件结构

Closes: VOI-71
```

**修复提交**：
```
fix(deployment): 修复 MIME type 错误导致模块加载失败 [VOI-76]

- 将 serve 替换为 http-server
- 更新 start.sh 脚本
- 修复 ES 模块 MIME type 问题

Closes: VOI-76
```

---

## 四、Pull Request 规范

### 4.1 PR 标题格式

```
<type>: <description> [<linear-issue-id>]
```

**示例**：
```
feat: 实现投注单基础框架与模式切换 [VOI-71]
fix: 修复部署 MIME type 错误 [VOI-76]
```

### 4.2 PR 描述模板

```markdown
## 关联 Issue

Linear Issue: [VOI-XX](https://linear.app/voidzyy/issue/VOI-XX)

## 变更内容

- [ ] 功能点 1
- [ ] 功能点 2
- [ ] 功能点 3

## 测试情况

- [ ] 本地开发环境测试通过
- [ ] TypeScript 类型检查通过
- [ ] 构建测试通过

## 截图/演示

（如适用，添加截图或 GIF）

## 备注

（其他需要说明的内容）
```

### 4.3 PR 合并规则

1. **自动关联 Linear Issue**：PR 标题或描述中包含 `[VOI-XX]` 会自动关联
2. **合并方式**：使用 Squash and Merge 保持提交历史清晰
3. **合并后操作**：
   - 自动删除功能分支
   - 在 Linear 中手动更新 Issue 状态为 Done
   - 在 Linear Issue 中添加 PR 链接作为附件

---

## 五、任务状态管理

### 5.1 状态管理职责分离

| 平台 | 职责 | 不应包含的内容 |
| :--- | :--- | :--- |
| **Linear** | 任务状态、优先级、依赖关系、进度跟踪 | 代码实现细节 |
| **GitHub** | 代码托管、版本控制、代码审查 | ❌ 任务状态、❌ 进度百分比、❌ 待办列表 |

### 5.2 禁止在 GitHub 中维护的内容

❌ **不要在 GitHub Issue 中维护任务状态**
- GitHub Issue 仅用于 Bug 报告或技术讨论
- 所有开发任务必须在 Linear 中创建

❌ **不要在 README 中维护任务进度表**
- 任务进度仅在 Linear 中查看
- README 应专注于项目介绍和快速开始

❌ **不要在 PR 描述中标注任务状态**
- 不要使用 "进行中"、"已完成" 等状态标签
- PR 描述应专注于代码变更内容

### 5.3 正确的状态同步方式

1. **Linear → GitHub**（单向同步）
   - Linear Issue 完成后，在 Issue 中添加 GitHub PR 链接作为附件
   - PR 合并后，在 Linear Issue 中添加评论记录交付信息

2. **GitHub → Linear**（反馈机制）
   - PR 审查意见可以在 Linear Issue 中添加评论
   - 代码实现细节可以在 Linear Issue 描述中补充

---

## 六、文档管理规范

### 6.1 文档分类

| 文档类型 | 存放位置 | 说明 |
| :--- | :--- | :--- |
| **项目说明** | `README.md` | 项目概述、快速开始、技术栈 |
| **部署指南** | `DEPLOYMENT.md` | 部署配置、环境变量、部署步骤 |
| **贡献指南** | `CONTRIBUTING.md` | 开发流程、代码规范、提交规范 |
| **项目规范** | `GITHUB_GUIDELINES.md` | GitHub 使用规范（本文档） |
| **API 文档** | `docs/api/` | API 接口文档 |
| **设计文档** | `docs/design/` | 产品设计、交互设计 |
| **知识库** | `docs/.knowledge/` | 项目知识库、最佳实践 |

### 6.2 文档更新原则

1. **及时更新**：代码变更涉及文档时，必须同步更新
2. **版本标注**：重要文档需标注版本号和更新日期
3. **清晰简洁**：文档应简洁明了，避免冗余信息
4. **中英文支持**：核心文档建议提供中英文版本

---

## 七、代码审查规范

### 7.1 审查检查项

- [ ] 代码符合 TypeScript 规范
- [ ] 无明显的性能问题
- [ ] 无安全漏洞
- [ ] 符合项目架构设计
- [ ] 测试覆盖充分
- [ ] 文档已更新

### 7.2 审查反馈

- 使用 GitHub PR Review 功能提供反馈
- 重要问题在 Linear Issue 中添加评论
- 审查通过后在 Linear 中更新状态

---

## 八、自动化工作流

### 8.1 GitHub Actions（待配置）

- **CI/CD**：自动构建、测试、部署
- **代码质量检查**：ESLint、TypeScript 类型检查
- **依赖更新**：Dependabot 自动更新依赖

### 8.2 Linear 集成

- **PR 关联**：PR 标题包含 `[VOI-XX]` 自动关联
- **状态同步**：PR 合并后手动更新 Linear Issue 状态

---

## 九、常见问题

### Q1: 为什么不在 GitHub 中维护任务状态？

**A**: 
- **单一数据源原则**：避免状态不一致
- **工具职责分离**：Linear 专注任务管理，GitHub 专注代码管理
- **提高效率**：减少重复维护工作

### Q2: 如何查看任务进度？

**A**: 
- 访问 [Linear 项目看板](https://linear.app/voidzyy/project/sports-betting-platform-b6c75c6e7fb5)
- 查看任务状态、优先级、依赖关系
- 通过 Linear Issue 查看关联的 GitHub PR

### Q3: PR 合并后需要做什么？

**A**: 
1. 在 Linear Issue 中更新状态为 Done
2. 在 Linear Issue 中添加 PR 链接作为附件
3. 在 Linear Issue 中添加评论记录交付信息
4. 验证功能是否正常

### Q4: 如何处理紧急 Bug？

**A**: 
1. 在 Linear 中创建 Issue，优先级设为 Urgent
2. 创建修复分支：`{username}/voi-{number}-fix-{desc}`
3. 提交 PR 并关联 Linear Issue
4. 合并后更新 Linear Issue 状态

---

## 十、参考资料

- [Linear 项目](https://linear.app/voidzyy/project/sports-betting-platform-b6c75c6e7fb5)
- [GitHub 仓库](https://github.com/gdszyy/sports-betting-platform)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

---

**维护者**: Manus AI  
**联系方式**: 在 Linear 或 GitHub 中提出问题
