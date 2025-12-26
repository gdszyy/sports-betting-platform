#!/bin/sh

# 确保在 frontend 目录下运行
cd frontend

# 使用 serve 提供静态文件服务
# serve 对 ES 模块的 MIME type 处理更加可靠，并支持 SPA 路由
npx serve dist -l $PORT -s
