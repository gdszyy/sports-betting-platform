# Railway 部署配置说明

## 问题诊断

Railway 部署时遇到的问题是由于项目根目录存在旧的前端配置文件，导致 Railway 错误地将根目录识别为前端项目。

## 已修复的问题

已删除根目录下的以下文件：
- `index.html` - 旧的开发模板（引用 `/src/main.tsx`）
- `vite.config.ts` - Vite 配置
- `postcss.config.js` - PostCSS 配置  
- `tailwind.config.js` - Tailwind 配置
- `tsconfig.json` 和 `tsconfig.node.json` - TypeScript 配置

这些文件的正确版本都保留在 `frontend/` 目录下。

## Railway 配置方案

### 方案一：设置 Root Directory（推荐）

在 Railway 项目设置中：

1. 进入项目的 **Settings** 页面
2. 找到 **Root Directory** 设置
3. 设置为：`frontend`
4. 保存并触发重新部署

这样 Railway 会将 `frontend/` 作为项目根目录，正确执行构建和部署。

### 方案二：使用当前配置（已优化）

如果不设置 Root Directory，当前配置也应该可以工作：

- `nixpacks.toml` 指定了正确的构建路径
- `start.sh` 使用绝对路径提供 `dist` 目录

## 验证部署

部署成功后，访问网站应该：
1. 加载构建后的 `index.html`（引用 `/assets/index-xxx.js`）
2. JavaScript 文件返回正确的 MIME 类型：`application/javascript`
3. 页面正常渲染，无控制台错误

## 当前配置文件

### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs", "pnpm"]
[phases.install]
cmds = ["cd frontend && pnpm install"]
[phases.build]
cmds = ["cd frontend && pnpm build"]
[start]
cmd = "./start.sh"
```

### start.sh
```sh
#!/bin/sh
cd /app/frontend/dist && npx serve . -l $PORT -s
```
