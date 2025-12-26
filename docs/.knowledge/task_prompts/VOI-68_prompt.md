# VOI-68: 盘口展示与Tab&Chip分类

**推荐模型**: `manus-1.6`  
**Linear Issue**: https://linear.app/voidzyy/issue/VOI-68  
**Git 分支**: `zhaoyiyinwinnie/voi-68-feature-盘口展示与tabchip分类`  
**依赖任务**: 无

---

## 任务提示词

```
你好！我需要你帮我完成盘口展示与Tab&Chip两级分类功能。

## 项目信息

- **GitHub 仓库**: https://github.com/gdszyy/sports-betting-platform
- **Linear Issue**: VOI-68 - 盘口展示与Tab&Chip分类
- **分支名称**: zhaoyiyinwinnie/voi-68-feature-盘口展示与tabchip分类
- **依赖**: 无

## 背景

这是体育博彩平台的核心功能之一，需要实现盘口的两级分类展示系统。请先阅读以下文档：

1. `docs/design/前端产品交互文档.md` - 第 3.4 章节详细说明了盘口展示需求
2. `docs/.knowledge/体育盘口Tab&Chip分类规则文档.md` - 完整的分类算法规则
3. `config/api.config.md` - API 接口文档

## 功能要求

### 1. 盘口数据获取

调用 `/v1/match/row/{match_id}` 接口获取比赛的所有盘口数据。

**API 域名**: `https://xpbet-service-api.helix.city`

**响应数据结构**:
```json
{
  "markets": [
    {
      "id": "market_id",
      "name": "盘口名称",
      "specifiers": [
        {
          "specifier": "hcp=-1.5",
          "product": 1,  // 1=滚球, 3=赛前
          "status": 1,   // 1=Active, -1=Suspended
          "outcomes": [
            {
              "id": "outcome_id",
              "name": "主队",
              "odds": 1.85
            }
          ]
        }
      ]
    }
  ]
}
```

### 2. Tab & Chip 分类算法

**分类优先级**:
```
优先级 1: Groups 字段 → 优先级 2: Specifiers 字段 → 优先级 3: 默认分配（"流行"）
```

**足球 Tab 分类**:
- 流行、进球、统计信息、球员、角球、黄牌、组合、上半场、下半场

**篮球 Tab 分类**:
- 流行、玩家积分、3分、关键传球、四分之一决赛、上半场

**Chip 分类**:
- 在每个 Tab 内，根据 Specifier 进一步分类
- Chip ID 格式: `{tab_id}_{specifier_name}_{specifier_value}`
- 示例: "四分之一决赛_quarternr_1" → 显示为 "第1节"

### 3. 盘口卡片结构

- 每个 **Market ID** 对应一张独立的盘口卡片
- 卡片头部展示盘口名称（`name`）
- 卡片内，每个 **Specifier** 组合代表一行
- 每行展示具体的投注项（Outcomes）及其赔率
- 若 `product=1`，卡片需标注 **"Live"** 标识

**卡片结构示意**:
```
┌─────────────────────────────────────────────────┐
│ [Live] 让分盘 (Handicap)                        │
├─────────────────────────────────────────────────┤
│ hcp=-1.5  │ 主队 -1.5 @ 1.85 │ 客队 +1.5 @ 1.95 │
│ hcp=-2.5  │ 主队 -2.5 @ 2.10 │ 客队 +2.5 @ 1.70 │
│ hcp=-3.5  │ 主队 -3.5 @ 2.45 │ 客队 +3.5 @ 1.55 │
└─────────────────────────────────────────────────┘
```

## 技术要点

### 1. 组件结构

建议创建以下组件：

```
src/components/Market/
├── MarketTabs.tsx        # Tab 一级分类
├── MarketChips.tsx       # Chip 二级分类
├── MarketCard.tsx        # 盘口卡片
├── MarketRow.tsx         # 盘口行（Specifier）
└── OutcomeButton.tsx     # 投注项按钮
```

### 2. 分类算法实现

```typescript
interface Market {
  id: string;
  name: string;
  groups?: string[];  // 用于 Tab 分类
  specifiers: Specifier[];
}

interface Specifier {
  specifier: string;  // 如 "hcp=-1.5|quarternr=1"
  product: number;    // 1=滚球, 3=赛前
  status: number;     // 1=Active, -1=Suspended
  outcomes: Outcome[];
}

// Tab 分类函数
function classifyMarketToTab(market: Market, sportId: string): string {
  // 优先级 1: 检查 groups 字段
  if (market.groups && market.groups.length > 0) {
    return mapGroupToTab(market.groups[0], sportId);
  }
  
  // 优先级 2: 检查 specifiers 字段
  const firstSpecifier = market.specifiers[0]?.specifier;
  if (firstSpecifier) {
    return mapSpecifierToTab(firstSpecifier, sportId);
  }
  
  // 优先级 3: 默认分配到"流行"
  return "流行";
}

// Chip 分类函数
function generateChipId(tabId: string, specifier: string): string {
  const parts = specifier.split('|');
  const specifierMap = parts.reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  // 根据 Tab 决定使用哪个 specifier 字段
  // 例如: "四分之一决赛" → 使用 "quarternr"
  const chipKey = getChipKeyForTab(tabId);
  const chipValue = specifierMap[chipKey];
  
  return `${tabId}_${chipKey}_${chipValue}`;
}
```

### 3. 状态管理

使用 React 状态管理：

```typescript
const [activeTab, setActiveTab] = useState<string>("流行");
const [activeChip, setActiveChip] = useState<string | null>(null);
const [markets, setMarkets] = useState<Market[]>([]);

// 过滤显示的盘口
const filteredMarkets = markets.filter(market => {
  const tabMatch = classifyMarketToTab(market, sportId) === activeTab;
  if (!activeChip) return tabMatch;
  
  const chipMatch = market.specifiers.some(spec => 
    generateChipId(activeTab, spec.specifier) === activeChip
  );
  return tabMatch && chipMatch;
});
```

## 验收标准

- [ ] Tab 分类正确（足球/篮球不同分类）
- [ ] Chip 筛选正常
- [ ] 盘口卡片结构正确
- [ ] Live 标识显示正确（product=1）
- [ ] 点击投注项可添加到投注单
- [ ] 代码通过 TypeScript 类型检查

## 工作流程

1. 克隆仓库并拉取最新代码
2. 创建并切换到指定分支
3. 阅读分类规则文档
4. 实现 Tab & Chip 分类算法
5. 创建盘口展示组件
6. 集成到比赛详情页
7. 测试分类逻辑
8. 提交代码并直接合并到 main 分支
9. 更新 Linear Issue 状态为 Done

**重要**: 不要创建 Pull Request，直接将代码合并到 main 分支。

请开始执行任务。
```

---

## 执行检查清单

- [ ] 分类规则文档已阅读
- [ ] 分支已创建并切换
- [ ] Tab 分类算法已实现
- [ ] Chip 分类算法已实现
- [ ] 盘口卡片组件已创建
- [ ] Live 标识已实现
- [ ] 与投注单集成
- [ ] 代码已提交
- [ ] 代码已合并到 main 分支
- [ ] Linear Issue 已更新
