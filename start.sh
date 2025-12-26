#!/bin/sh

# 确保在 frontend 目录下运行
cd frontend

# 启动静态文件服务（假设 build 产物在 dist 目录）
# 如果是 Vite 项目，通常使用 serve 或类似的工具
# 这里我们使用 npx serve 来提供服务
npx serve -s dist -l $PORT
