# 交接文档 (Handover Document)

**项目名称**: 体育博彩平台 (Sports Betting Platform)  
**最后更新**: 2025-12-26  
**当前状态**: 项目初始化阶段

---

## 1. 项目概述

本项目是一个体育博彩平台的前端应用，采用 AI 驱动的项目管理模式，整合 GitHub（硬记忆）、Linear（信息中枢）和 Railway（实时部署）三大核心组件。

### 核心功能

1. **比赛导航**: 三级联动（体育项目 → 赛区 → 联赛）
2. **比赛列表**: 展示比赛信息，滚球标识，内存优化
3. **盘口展示**: Tab & Chip 两级分类系统
4. **投注单**: 单注模式（赔率监控）+ 过关模式（Ways组合）
5. **实时通信**: WebSocket 数据推送

### 技术栈

- **前端框架**: React + TypeScript
- **样式方案**: TailwindCSS
- **状态管理**: 待定
- **构建工具**: Vite
- **部署平台**: Railway

---

## 2. 当前进度

### 已完成

- [x] GitHub 仓库创建
- [x] Linear 项目创建
- [x] 知识库文档整理
- [x] 通用提示词撰写
- [x] 前端产品交互文档

### 进行中

- [ ] 项目脚手架搭建
- [ ] 基础组件开发

### 待开始

- [ ] 比赛导航模块
- [ ] 比赛列表模块
- [ ] 盘口展示模块
- [ ] 投注单模块
- [ ] WebSocket 集成

---

## 3. 关键设计决策

### 3.1 内存管理策略

> **重要**: `/v1/match` 接口返回的 `markets` 字段会包含大量数据。前端在获取到比赛列表后，应立即清空每个比赛对象中的 `markets` 数组，并手动触发垃圾回收以释放内存。

```javascript
// 示例代码
const matches = await fetchMatches();
matches.forEach(match => {
  match.markets = []; // 清空 markets
});
```

### 3.2 滚球标识规则

- `product=1` → 滚球盘 → 显示 **"Live"** 标识
- `product=3` → 赛前盘 → 默认展示

### 3.3 盘口卡片结构

- 每个 **Market ID** 对应一张独立的盘口卡片
- 每个 **Specifier** 组合代表卡片中的一行
- 每行展示具体的投注项（Outcomes）及其赔率

### 3.4 Tab & Chip 分类优先级

```
优先级 1: Groups 字段 → 优先级 2: Specifiers 字段 → 优先级 3: 默认分配（"流行"）
```

---

## 4. API 接口清单

| 接口 | 用途 | 关键参数 |
| :--- | :--- | :--- |
| `/v1/menu/sports` | 体育项目列表 | - |
| `/v1/menu/category` | 赛区列表 | `sport_id` |
| `/v1/menu/tournament` | 联赛列表 | `cate_id` |
| `/v1/match` | 比赛列表 | `tournament_id`, `cursor`, `limit` |
| `/v1/match/{match_id}` | 比赛详情 Header | `match_id` |
| `/v1/match/row/{match_id}` | 比赛盘口数据 | `match_id` |

### WebSocket 消息类型

| CMD | 类型 | 说明 |
| :--- | :--- | :--- |
| 10000 | Alive | 心跳检测 |
| 10010 | Fixture Change | 赛程变更 |
| 10020 | Odds Change | 赔率变化 |
| 10030 | BetStop | 停止投注 |
| 10060 | Match Status | 比赛状态 |

---

## 5. 已知问题与风险

### 待解决问题

1. **无**: 项目刚初始化，暂无已知问题

### 潜在风险

1. **内存泄漏**: 需严格执行 markets 清空策略
2. **WebSocket 断线**: 需实现重连机制
3. **大数据量渲染**: 需考虑虚拟列表优化

---

## 6. 下一步行动

1. 使用 `web-static` 脚手架初始化前端项目
2. 实现比赛导航模块（VOI-66）
3. 实现比赛列表模块（VOI-67）

---

## 7. 相关链接

- **GitHub**: https://github.com/gdszyy/sports-betting-platform
- **Linear Project**: https://linear.app/voidzyy/project/sports-betting-platform-b6c75c6e7fb5
- **Railway**: 待配置

---

## 8. 联系方式

如有问题，请在 Linear 中创建 Issue 或直接在 GitHub 提交 PR。
