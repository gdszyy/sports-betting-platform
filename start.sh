#!/bin/sh

# 确保在 frontend 目录下运行
cd frontend

# 使用 http-server 提供静态文件服务
# http-server 对 ES 模块的 MIME type 处理更加可靠
npx http-server dist -p $PORT --gzip -c-1
