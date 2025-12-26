# 部署指南

本项目支持在 Railway/Railpack 平台上进行部署。

## 配置文件说明

- `package.json`: 根目录下的配置文件，定义了安装、构建和启动脚本。
- `nixpacks.toml`: Nixpacks 构建配置，指定了运行环境和构建步骤。
- `start.sh`: 生产环境启动脚本，使用 `serve` 提供静态文件服务。
- `.env.example`: 环境变量示例文件。

## 部署步骤

1. **关联 GitHub 仓库**: 在 Railway 平台上创建一个新项目并关联此仓库。
2. **配置环境变量**:
   - `PORT`: 服务端口（Railway 会自动提供）。
   - `VITE_API_BASE_URL`: 后端 API 基础地址。
   - `VITE_WS_URL`: WebSocket 服务地址。
3. **构建与部署**: Railway 会根据 `nixpacks.toml` 自动进行构建和部署。

## 本地验证

在本地测试部署配置：

```bash
pnpm install
pnpm build
./start.sh
```
