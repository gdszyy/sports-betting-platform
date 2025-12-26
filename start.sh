#!/bin/sh

# 使用 serve 提供静态文件服务
# serve 对 ES 模块的 MIME type 处理更加可靠，并支持 SPA 路由
# 使用绝对路径确保正确提供 frontend/dist 目录
cd /app/frontend/dist && npx serve . -l $PORT -s
