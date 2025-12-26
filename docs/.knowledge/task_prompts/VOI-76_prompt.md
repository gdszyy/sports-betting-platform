# VOI-76: 部署配置修复 - 添加Railway/Railpack构建配置

**推荐模型**: `manus-1.6-lite`  
**Linear Issue**: https://linear.app/voidzyy/issue/VOI-76  
**Git 分支**: `zhaoyiyinwinnie/voi-76-voi-76-部署配置修复-添加railwayrailpack构建配置`  
**优先级**: Urgent

---

## 任务提示词

```
你好！我需要你帮我修复体育博彩平台项目的部署配置问题。

## 项目信息

- **GitHub 仓库**: https://github.com/gdszyy/sports-betting-platform
- **Linear Issue**: VOI-76 - 部署配置修复
- **Issue URL**: https://linear.app/voidzyy/issue/VOI-76
- **分支名称**: zhaoyiyinwinnie/voi-76-voi-76-部署配置修复-添加railwayrailpack构建配置

## 问题描述

项目在Railway/Railpack平台部署时失败，报错：

```
⚠ Script start.sh not found
✖ Railpack could not determine how to build the app.
```

**根本原因**: 
- 项目根目录缺少构建配置文件
- 前端代码在 `frontend/` 子目录中，但根目录没有配置

## 修复任务

### 1. 创建根目录 package.json

在项目根目录创建 `package.json`:

```json
{
  "name": "sports-betting-platform",
  "version": "1.0.0",
  "description": "Sports Betting Platform",
  "scripts": {
    "install": "cd frontend && pnpm install",
    "build": "cd frontend && pnpm run build",
    "start": "cd frontend && pnpm run preview --host 0.0.0.0 --port ${PORT:-3000}",
    "dev": "cd frontend && pnpm run dev"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

### 2. 创建 start.sh 启动脚本

在项目根目录创建 `start.sh`:

```bash
#!/bin/bash
cd frontend
pnpm run preview --host 0.0.0.0 --port ${PORT:-3000}
```

并设置执行权限: `chmod +x start.sh`

### 3. 创建 nixpacks.toml 配置

在项目根目录创建 `nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "pnpm"]

[phases.install]
cmds = ["cd frontend && pnpm install"]

[phases.build]
cmds = ["cd frontend && pnpm run build"]

[start]
cmd = "cd frontend && pnpm run preview --host 0.0.0.0 --port ${PORT:-3000}"
```

### 4. 更新 .env.example

添加部署相关环境变量:

```bash
# 部署配置
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# API配置
VITE_API_BASE_URL=https://xpbet-service-api.helix.city
VITE_WS_URL=wss://xpbet-ws-api.helix.city/ws
```

### 5. 创建 DEPLOYMENT.md 部署文档

创建完整的部署指南，包括：

#### 部署平台配置

- Railway/Render/Vercel 等平台的配置步骤
- 环境变量设置说明
- 构建命令和启动命令配置

#### 本地测试验证

```bash
# 安装依赖
cd frontend
pnpm install

# 构建项目
pnpm run build

# 本地预览
pnpm run preview
```

#### 环境变量配置

列出所有必需的环境变量及其说明

#### 故障排查

- 常见部署错误及解决方案
- 日志查看方法
- 性能优化建议

## 验收标准

- [ ] 根目录 package.json 已创建且配置正确
- [ ] start.sh 已创建并设置执行权限
- [ ] nixpacks.toml 已创建且配置正确
- [ ] .env.example 已更新
- [ ] DEPLOYMENT.md 文档已创建且内容完整
- [ ] 本地可以成功构建: `cd frontend && pnpm install && pnpm run build`
- [ ] 本地可以成功预览: `cd frontend && pnpm run preview`
- [ ] 所有文件已提交到Git
- [ ] PR已创建
- [ ] Linear Issue已更新为Done

## 工作流程

1. 克隆仓库: `gh repo clone gdszyy/sports-betting-platform`
2. 创建并切换到指定分支
3. 创建所有必要的配置文件
4. 本地测试验证
5. 提交代码并创建Pull Request
6. 更新Linear Issue状态为Done

请开始执行任务，有任何问题随时告诉我。
```

---

## 执行检查清单

- [ ] 仓库已克隆
- [ ] 分支已创建并切换
- [ ] package.json 已创建
- [ ] start.sh 已创建并设置权限
- [ ] nixpacks.toml 已创建
- [ ] .env.example 已更新
- [ ] DEPLOYMENT.md 已创建
- [ ] 本地构建测试通过
- [ ] 本地预览测试通过
- [ ] 代码已提交
- [ ] PR 已创建
- [ ] Linear Issue 已更新

---

## 相关文档

- [部署配置修复方案](../../deployment_fix_analysis.md)
- [API配置文档](../../../config/api.config.md)
- [前端产品交互文档](../../design/前端产品交互文档.md)

---

## 注意事项

1. **优先级高**: 这是阻塞部署的紧急问题，需要优先处理
2. **无依赖**: 可以立即开始执行，不需要等待其他任务
3. **测试验证**: 必须在本地验证构建和预览成功后再提交
4. **文档完整**: DEPLOYMENT.md 必须包含详细的部署步骤和故障排查指南
