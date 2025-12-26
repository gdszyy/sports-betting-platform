# API域名更新说明

**更新日期**: 2025-12-26  
**更新人**: Manus AI

---

## 更新内容

本次更新将项目的API域名配置统一更新为：

- **主API服务域名**: `https://xpbet-service-api.helix.city`
- **WebSocket服务域名**: `wss://xpbet-ws-api.helix.city/ws`

---

## 更新文件列表

1. **config/api.config.md** (新增)
   - 完整的API域名配置文档
   - 包含所有API端点列表
   - WebSocket消息类型说明
   - 使用示例和注意事项

2. **docs/design/前端产品交互文档.md** (更新)
   - 在"API集成策略"章节添加域名配置说明
   - 添加配置文档引用链接

3. **.env.example** (新增)
   - 环境变量配置示例文件
   - 包含API和WebSocket域名配置

---

## 开发者行动项

### 1. 环境变量配置

开发者需要在项目根目录创建 `.env` 文件（基于 `.env.example`）：

```bash
cp .env.example .env
```

### 2. 前端代码集成

在前端项目中创建API配置文件：

```typescript
// src/config/api.config.ts
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://xpbet-service-api.helix.city',
  wsURL: import.meta.env.VITE_WS_URL || 'wss://xpbet-ws-api.helix.city/ws',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
};
```

### 3. Axios实例配置

```typescript
// src/utils/axios.ts
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

### 4. WebSocket连接

```typescript
// src/utils/websocket.ts
import { API_CONFIG } from '@/config/api.config';

export class WebSocketClient {
  private ws: WebSocket | null = null;

  connect() {
    this.ws = new WebSocket(API_CONFIG.wsURL);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // 处理消息
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // 实现重连逻辑
    };
  }
}
```

---

## 验证步骤

1. 确认 `.env` 文件已正确配置
2. 启动开发服务器，检查API请求是否使用正确的域名
3. 检查浏览器开发者工具的Network标签，确认请求URL
4. 测试WebSocket连接是否正常建立

---

## 相关文档

- [API配置文档](config/api.config.md)
- [前端产品交互文档](docs/design/前端产品交互文档.md)
- [环境变量示例](.env.example)

---

## 注意事项

1. **不要提交 `.env` 文件到Git仓库**，该文件已添加到 `.gitignore`
2. 所有API请求必须使用配置的域名，避免硬编码
3. WebSocket连接应在应用初始化时建立，并实现断线重连机制
4. 生产环境部署时，需要通过CI/CD配置相应的环境变量

---

## 问题反馈

如有任何问题，请在GitHub Issues或Linear中提出。
