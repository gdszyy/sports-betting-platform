# API 配置文档

**更新日期**: 2025-12-26  
**版本**: 1.0

---

## API 域名配置

### 主API服务域名

**域名**: `https://xpbet-service-api.helix.city`

**用途**: 所有RESTful API请求的基础域名

**API端点列表**:

| 端点 | 方法 | 描述 |
| :--- | :--- | :--- |
| `/v1/menu/sports` | GET | 获取体育项目列表 |
| `/v1/menu/category` | GET | 获取国家/赛区列表 |
| `/v1/menu/tournament` | GET | 获取联赛/锦标赛列表 |
| `/v1/menu/breadcrumb` | GET | 获取面包屑导航 |
| `/v1/match` | GET | 获取比赛列表 |
| `/v1/match/{match_id}` | GET | 获取比赛详情 |
| `/v1/match/row/{match_id}` | GET | 获取比赛完整盘口数据 |
| `/v1/match/{match_id}/market` | GET | 分页获取比赛盘口数据 |

---

### WebSocket服务域名

**域名**: `wss://xpbet-ws-api.helix.city/ws`

**用途**: 实时数据推送（赔率变化、比赛状态更新等）

**消息类型**:

| 消息类型 | CMD | 描述 |
| :--- | :--- | :--- |
| Fixture Change | 10010 | 比赛赛程变更通知 |
| Odds Change | 10020 | 赔率变化通知 |
| Alive | 10000 | UOF心跳消息 |
| BetStop | 10030 | 停止投注通知 |
| BetCancel | 10050 | 取消投注通知 |
| Match Status | 10060 | 比赛状态变更通知 |

---

## 环境变量配置建议

建议在项目中使用环境变量来管理API域名配置：

```bash
# .env.development
VITE_API_BASE_URL=https://xpbet-service-api.helix.city
VITE_WS_URL=wss://xpbet-ws-api.helix.city/ws

# .env.production
VITE_API_BASE_URL=https://xpbet-service-api.helix.city
VITE_WS_URL=wss://xpbet-ws-api.helix.city/ws
```

---

## 使用示例

### TypeScript/JavaScript

```typescript
// api.config.ts
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://xpbet-service-api.helix.city',
  wsURL: import.meta.env.VITE_WS_URL || 'wss://xpbet-ws-api.helix.city/ws',
  timeout: 10000,
};

// 使用示例
import axios from 'axios';
import { API_CONFIG } from './api.config';

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

// WebSocket连接
const ws = new WebSocket(API_CONFIG.wsURL);
```

---

## 注意事项

1. **内存管理**: 调用 `/v1/match` 接口获取比赛列表后，应立即清空每个比赛对象中的 `markets` 数组以释放内存
2. **实时更新**: WebSocket连接应在应用初始化时建立，并在整个应用生命周期中保持连接
3. **错误处理**: 当WebSocket `Alive` 消息的 `offset_time > 20` 时，应暂停所有投注功能并提示用户
4. **分页加载**: 对于大量盘口数据，应使用 `/v1/match/{match_id}/market` 接口进行分页加载

---

## 更新日志

| 日期 | 版本 | 更新内容 |
| :--- | :--- | :--- |
| 2025-12-26 | 1.0 | 初始版本，配置API和WebSocket域名 |
