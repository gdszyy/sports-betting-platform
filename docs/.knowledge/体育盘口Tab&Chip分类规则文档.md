# 体育盘口 Tab & Chip 分类规则文档

**文档版本**: 1.0  
**更新日期**: 2025-12-24  
**作者**: Manus AI

---

## 目录

1. [概述](#概述)
2. [Tab 分类规则](#tab-分类规则)
3. [Chip 分组规则](#chip-分组规则)
4. [足球盘口分类](#足球盘口分类)
5. [篮球盘口分类](#篮球盘口分类)
6. [分配算法](#分配算法)
7. [实现示例](#实现示例)

---

## 概述

**Tab & Chip** 是一种两层级的盘口分类系统，用于组织和展示体育投注的市场数据。

- **Tab**（标签页）：第一层分类，用于按盘口类型进行主要分组（如"流行"、"进球"、"球员"等）
- **Chip**（芯片/标签）：第二层分组，用于在同一 Tab 下按具体条件进行细分（如"第1节"、"第2节"等）

这种分层结构使用户能够快速找到感兴趣的盘口，同时保持界面的整洁和易用性。

---

## Tab 分类规则

### 1. Tab 分配优先级

Tab 的分配遵循**三层优先级**系统：

```
优先级 1: Groups 字段 → 优先级 2: Specifiers 字段 → 优先级 3: 默认分配
```

#### 优先级 1：基于 Groups 字段

**工作原理**
- 从市场数据的 `groups` 字段提取标签列表（由 `|` 分隔）
- 按顺序遍历每个标签，与预定义的映射表进行匹配
- **找到第一个匹配项后立即停止并分配对应的 Tab ID**

**Groups-to-Tab 映射表**

| Groups 标签 | 分配的 Tab ID | 适用运动 |
| :--- | :--- | :--- |
| `regular_play` | 流行 | 足球、篮球、其他 |
| `score` / `goals` | 进球 | 足球 |
| `statistics` | 统计信息 | 足球、篮球 |
| `player_props` | 球员 | 足球、篮球 |
| `scorers` | 射手 | 足球 |
| `corners` | 角球 | 足球 |
| `bookings` | 黄牌 | 足球 |
| `overtime` | 加时 | 足球 |
| `combo` | 组合 | 足球、篮球 |
| `player_points` | 玩家积分 | 篮球 |
| `3_pointers` / `three_point` | 3分 | 篮球 |
| `assists` | 关键传球 | 篮球 |
| `steals` | 抢断 | 篮球 |
| `alternative` | 替代 | 篮球 |
| `specials` | 特别 | 篮球 |
| `handicap` | 残疾（让分） | 篮球 |
| `1st_half` | 上半场 | 足球、篮球 |
| `2nd_half` | 下半场 | 足球、篮球 |
| `quarters` | 四分之一决赛 | 篮球 |
| `innings` | 局/局数 | 棒球 |
| `sets` | 盘/盘数 | 网球 |
| `maps` | 地图 | 电竞 |
| `periods` | 节/节数 | 冰球 |
| `frames` | 局 | 台球 |
| `overs` | 轮 | 板球 |
| `drives` | 进攻 | 美式足球 |

**示例**
```
Groups: "all|score|1st_half"
→ 遍历: "all" (无匹配) → "score" (匹配) → 分配 Tab = "进球"
```

#### 优先级 2：基于 Specifiers 字段

**工作原理**
- 如果 `groups` 字段为空或未找到匹配项，则检查 `specifiers` 字段
- 使用字符串匹配检查是否包含特定的关键字
- 找到匹配项后分配对应的 Tab ID

**Specifiers-to-Tab 映射表**

| Specifier 关键字 | 分配的 Tab ID | 说明 |
| :--- | :--- | :--- |
| `inningnr` | 局/局数 | 棒球局数 |
| `setnr` | 盘/盘数 | 网球盘数 |
| `mapnr` | 地图 | 电竞地图编号 |
| `quarternr` | 四分之一决赛 | 篮球节数 |
| `periodnr` | 节/节数 | 冰球节数 |
| `framenr` | 局 | 台球局数 |
| `overnr` | 轮 | 板球轮数 |
| `drivenr` | 进攻 | 美式足球进攻编号 |

**示例**
```
Groups: "" (空)
Specifiers: "[{\"name\": \"quarternr\", \"type\": \"integer\"}]"
→ 检查是否包含 "quarternr" → 是 → 分配 Tab = "四分之一决赛"
```

#### 优先级 3：默认分配

- 如果以上两个优先级都未找到匹配项，则分配默认 Tab ID：**"流行"**

---

## Chip 分组规则

### 1. Chip 分配逻辑

**工作原理**
1. 检查市场的 `tab_id` 是否存在于"主 Specifier 映射表"中
2. 如果存在，从市场的 `specifiers` 字段中提取该主 Specifier 的值
3. 生成 Chip ID：`{tab_id}_{specifier_name}_{specifier_value}`
4. 如果不存在对应的主 Specifier，则 Chip ID 为空

### 2. Tab-to-Primary-Specifier 映射表

| Tab ID | 对应的主 Specifier | 说明 |
| :--- | :--- | :--- |
| 局/局数 | `inningnr` | 棒球中的局数 |
| 盘/盘数 | `setnr` | 网球中的盘数 |
| 地图 | `mapnr` | 电竞中的地图编号 |
| 四分之一决赛 | `quarternr` | 篮球中的节数 |
| 节/节数 | `periodnr` | 冰球中的节数 |
| 局 | `framenr` | 台球中的局数 |
| 轮 | `overnr` | 板球中的轮数 |
| 进攻 | `drivenr` | 美式足球中的进攻编号 |
| 上半场 | `goalnr` | 足球中的进球编号 |
| 下半场 | `goalnr` | 足球中的进球编号 |
| 角球 | `cornernr` | 足球中的角球编号 |

### 3. Chip ID 生成示例

**示例 1：篮球四分之一决赛**
```
Tab ID: "四分之一决赛"
Specifier: "quarternr=1"
→ Chip ID = "四分之一决赛_quarternr_1"
```

**示例 2：足球角球**
```
Tab ID: "角球"
Specifier: "cornernr=5"
→ Chip ID = "角球_cornernr_5"
```

**示例 3：无对应主 Specifier**
```
Tab ID: "流行"
Specifier: ""
→ Chip ID = "" (空)
```

---

## 足球盘口分类

### 足球 Tab 分类详解

| Tab 名称 | 说明 | 常见盘口 | 示例 |
| :--- | :--- | :--- | :--- |
| **流行** | 最常见的盘口，包括基础投注 | 1X2、让球、大小球 | 主队胜、平、客队胜 |
| **进球** | 与进球相关的所有盘口 | 进球数、进球者、首进球者 | 谁会进球、总进球数 |
| **统计信息** | 比赛统计数据相关 | 角球数、黄牌数、射门数 | 比赛总角球数 |
| **球员** | 球员个人表现相关 | 球员进球、球员助攻 | 特定球员是否进球 |
| **射手** | 进球者相关盘口 | 进球者名单、首进球者 | 谁会成为进球者 |
| **角球** | 角球相关盘口 | 角球总数、角球大小 | 比赛总角球数大于/小于 X |
| **黄牌** | 黄牌相关盘口 | 黄牌总数、黄牌大小 | 比赛总黄牌数大于/小于 X |
| **加时** | 加时赛相关盘口 | 是否加时、加时进球 | 是否会进行加时赛 |
| **组合** | 多个条件组合 | 半全场、进球+大小球 | 上半场平 + 全场主队胜 |
| **上半场** | 上半场专属盘口 | 上半场1X2、上半场大小球 | 上半场主队胜 |
| **下半场** | 下半场专属盘口 | 下半场1X2、下半场大小球 | 下半场客队胜 |

### 足球 Chip 分组示例

**场景：上半场进球数**
```
Tab: "进球"
Chip: "进球_goalnr_1" (第1个进球)
Chip: "进球_goalnr_2" (第2个进球)
Chip: "进球_goalnr_3" (第3个进球)
```

---

## 篮球盘口分类

### 篮球 Tab 分类详解

| Tab 名称 | 说明 | 常见盘口 | 示例 |
| :--- | :--- | :--- | :--- |
| **流行** | 最常见的盘口 | 胜负、让分、大小分 | 主队胜、让分大小 |
| **玩家积分** | 球员个人得分相关 | 球员得分、球员得分大小 | 特定球员是否得分超过 X |
| **3分** | 三分球相关盘口 | 三分球总数、三分球大小 | 比赛总三分球数 |
| **关键传球** | 助攻相关盘口 | 总助攻数、助攻大小 | 比赛总助攻数大于/小于 X |
| **抢断** | 抢断相关盘口 | 总抢断数、抢断大小 | 比赛总抢断数大于/小于 X |
| **替代** | 替补球员相关 | 替补得分、替补表现 | 替补球员总得分 |
| **特别** | 特殊盘口 | 双双数据、三双数据 | 是否出现双双/三双 |
| **上半场** | 上半场专属盘口 | 上半场胜负、上半场大小分 | 上半场主队胜 |
| **残疾（让分）** | 让分盘口 | 让分胜负、让分大小 | 主队让 5 分胜 |
| **四分之一决赛** | 按节分类的盘口 | 单节胜负、单节大小分 | 第1节主队胜 |

### 篮球 Chip 分组示例

**场景：按节分类的盘口**
```
Tab: "四分之一决赛"
Chip: "四分之一决赛_quarternr_1" (第1节)
Chip: "四分之一决赛_quarternr_2" (第2节)
Chip: "四分之一决赛_quarternr_3" (第3节)
Chip: "四分之一决赛_quarternr_4" (第4节)
```

---

## 分配算法

### 伪代码实现

```javascript
// Tab 分配算法
function determineTabId(groups, specifiers) {
  // 优先级 1: 基于 groups 分配
  if (groups) {
    const groupList = groups.split('|');
    for (const g of groupList) {
      if (GROUP_TO_TAB[g]) {
        return GROUP_TO_TAB[g];
      }
    }
  }

  // 优先级 2: 基于 specifiers 分配
  if (specifiers) {
    for (const [specKey, tabId] of Object.entries(SPECIFIER_TO_TAB)) {
      if (specifiers.includes(specKey)) {
        return tabId;
      }
    }
  }

  // 优先级 3: 默认分配
  return "流行";
}

// Chip 分配算法
function determineChipId(tabId, specifier) {
  const primarySpec = TAB_TO_PRIMARY_SPECIFIER[tabId];
  if (!primarySpec) return "";

  // 从 specifier 字符串中提取值
  // 格式: "quarternr=1" 或 "total=2.5"
  const match = specifier.match(new RegExp(`${primarySpec}=([^,|]*)`));
  if (match && match[1]) {
    return `${tabId}_${primarySpec}_${match[1]}`;
  }

  return "";
}

// 按 Tab 和 Chip 分组
function groupMarketsByTabChip(markets) {
  const grouped = {};

  for (const market of markets) {
    if (!grouped[market.tab_id]) {
      grouped[market.tab_id] = {};
    }

    const chipKey = market.chip_id || "default";
    if (!grouped[market.tab_id][chipKey]) {
      grouped[market.tab_id][chipKey] = [];
    }

    grouped[market.tab_id][chipKey].push(market);
  }

  return grouped;
}
```

---

## 实现示例

### 示例 1：足球比赛盘口分类

**原始数据**
```json
{
  "market_id": "1",
  "market_name": "1X2",
  "groups": "regular_play|score",
  "specifiers": "",
  "outcomes": [...]
}
```

**分配结果**
```json
{
  "market_id": "1",
  "market_name": "1X2",
  "tab_id": "流行",
  "chip_id": "",
  "outcomes": [...]
}
```

**UI 展示位置**
```
Tab: 流行
├── 默认分组
    ├── 1X2 (主队胜、平、客队胜)
```

---

### 示例 2：篮球按节分类的盘口

**原始数据**
```json
{
  "market_id": "2",
  "market_name": "Quarter Winner",
  "groups": "quarters",
  "specifiers": "quarternr=1",
  "outcomes": [...]
}
```

**分配结果**
```json
{
  "market_id": "2",
  "market_name": "Quarter Winner",
  "tab_id": "四分之一决赛",
  "chip_id": "四分之一决赛_quarternr_1",
  "outcomes": [...]
}
```

**UI 展示位置**
```
Tab: 四分之一决赛
├── Chip: 四分之一决赛_quarternr_1 (第1节)
    ├── Quarter Winner (主队胜、平、客队胜)
├── Chip: 四分之一决赛_quarternr_2 (第2节)
    ├── Quarter Winner (主队胜、平、客队胜)
```

---

### 示例 3：足球角球盘口

**原始数据**
```json
{
  "market_id": "3",
  "market_name": "Corner Race",
  "groups": "corners",
  "specifiers": "cornernr=5",
  "outcomes": [...]
}
```

**分配结果**
```json
{
  "market_id": "3",
  "market_name": "Corner Race",
  "tab_id": "角球",
  "chip_id": "角球_cornernr_5",
  "outcomes": [...]
}
```

**UI 展示位置**
```
Tab: 角球
├── Chip: 角球_cornernr_5 (第5个角球)
    ├── Corner Race (主队先达到、平、客队先达到)
```

---

## 总结

**Tab & Chip 分类系统**通过两层级的分组结构，使用户能够：

1. **快速导航**：通过 Tab 快速定位盘口类型
2. **精细筛选**：通过 Chip 进一步细分具体条件
3. **提升体验**：保持界面整洁，避免信息过载

**关键设计原则**：
- **优先级清晰**：Groups > Specifiers > Default
- **映射完整**：覆盖足球、篮球、棒球、网球等多种运动
- **可扩展性**：易于添加新的 Tab 和 Chip 类型
- **用户友好**：中文标签便于理解和使用

