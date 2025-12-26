# 盘口展示与Tab&Chip分类功能实现文档

**实现日期**: 2025-12-26  
**Issue**: VOI-68  
**分支**: zhaoyiyinwinnie/voi-68-feature-盘口展示与tabchip分类

## 功能概述

实现了体育博彩平台的盘口展示与两级分类系统，包括Tab（一级分类）和Chip（二级分类）功能。

## 验收标准完成情况

- ✅ Tab分类正确 - 根据Groups和Specifiers正确分类
- ✅ Chip筛选正常 - 支持按Chip筛选盘口
- ✅ 盘口卡片结构正确 - 每个Market ID一张卡片，每个Specifier一行
- ✅ Live标识显示正确 - 滚球盘显示Live标识和动画

## 实现的核心功能

### 1. 盘口分类算法
- 三层优先级：Groups > Specifiers > Default
- 支持足球、篮球等多种运动
- 自动生成Chip分组

### 2. API服务层
- 获取比赛详情和盘口数据
- 支持分页加载

### 3. UI组件
- MarketCard: 盘口卡片
- MarketTabs: Tab & Chip导航
- MatchDetail: 比赛详情页
- MarketDemo: 演示页面

## 文件清单

### 新增文件
- frontend/src/utils/marketClassifier.ts
- frontend/src/services/apiService.ts
- frontend/src/components/MarketCard.tsx
- frontend/src/components/MarketTabs.tsx
- frontend/src/components/MatchDetail.tsx
- frontend/src/components/MarketDemo.tsx
- frontend/src/vite-env.d.ts

### 修改文件
- frontend/src/App.tsx
- frontend/vite.config.ts
