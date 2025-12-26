#!/usr/bin/env python3
"""
投注单交互系统子任务并行执行脚本

使用 Manus API 创建 Agent 对话来执行 VOI-71 到 VOI-75 的子任务。
根据任务复杂度选择合适的模型：
- manus-1.6-lite: 常规任务
- manus-1.6: 复杂任务（拆解后仍复杂）
- manus-1.6-max: 无法解耦的复杂任务（尽量避免）
"""

import os
import json
import requests
from typing import Dict, List, Optional
from dataclasses import dataclass

# Manus API 配置
MANUS_API_BASE = "https://api.manus.ai/v1"
MANUS_API_KEY = os.environ.get("MANUS_API_KEY", "")

# GitHub 仓库信息
GITHUB_REPO = "gdszyy/sports-betting-platform"

@dataclass
class SubTask:
    """子任务定义"""
    issue_id: str
    title: str
    branch: str
    model: str  # manus-1.6-lite, manus-1.6, manus-1.6-max
    prompt: str
    dependencies: List[str] = None  # 依赖的其他任务 ID

# 定义子任务
SUBTASKS = [
    SubTask(
        issue_id="VOI-71",
        title="投注单基础框架与模式切换",
        branch="zhaoyiyinwinnie/voi-71-feature-投注单基础框架与模式切换",
        model="manus-1.6-lite",
        prompt="""
## 任务: VOI-71 - 投注单基础框架与模式切换

### 项目背景
你正在开发一个体育博彩平台的前端。请参考 GitHub 仓库中的产品文档。

### 功能要求
1. 实现投注单的基础框架组件
2. 实现单关/串关模式切换 (Tab)
3. 实现金额输入逻辑：
   - 单关模式：每个选项独立金额输入框
   - 串关模式：全局金额输入框

### 技术栈
- React 18 + TypeScript
- TailwindCSS
- Zustand (状态管理)

### 组件结构
- BetSlip (容器)
- BetSlipHeader (模式切换)
- BetSlipItem (投注选项卡片)
- BetSlipFooter (总金额、下注按钮)

### 交付要求
1. 代码提交到指定分支
2. 通过 TypeScript 类型检查
3. 创建 Pull Request
""",
        dependencies=[]
    ),
    SubTask(
        issue_id="VOI-72",
        title="投注单状态管理与UI展示",
        branch="zhaoyiyinwinnie/voi-72-feature-投注单状态管理与ui展示",
        model="manus-1.6-lite",
        prompt="""
## 任务: VOI-72 - 投注单状态管理与UI展示

### 项目背景
基于 VOI-71 的投注单基础框架，实现状态管理和 UI 展示。

### 功能要求
1. 实现各种状态的 UI 展示：
   - 锁盘/失效：背景变灰，显示图标
   - 串关冲突：提示"同一比赛无法串关"
   - 赔率变化：高亮动画（绿色升/红色降）

2. 实现接受赔率变化设置：
   - 不接受任何变化
   - 接受任何变化
   - 只接受更高赔率

3. 实现冲突检测逻辑

### 技术栈
- React 18 + TypeScript
- TailwindCSS + Framer Motion (动画)
- Zustand (状态管理)

### 交付要求
1. 代码提交到指定分支
2. 状态切换动画流畅
3. 创建 Pull Request
""",
        dependencies=["VOI-71"]
    ),
    SubTask(
        issue_id="VOI-73",
        title="投注生命周期与等待处理",
        branch="zhaoyiyinwinnie/voi-73-feature-投注生命周期与等待处理",
        model="manus-1.6-lite",
        prompt="""
## 任务: VOI-73 - 投注生命周期与等待处理

### 项目背景
实现投注提交后的等待处理逻辑。

### 功能要求
1. 等待时间：
   - 赛前盘: 0-3 秒
   - 滚球盘: 0-16 秒

2. 投注中状态：
   - 可继续添加新盘口
   - 下注按钮禁用
   - 已提交注单显示加载动画
   - 已提交注单无法修改

3. 悬浮窗设计：
   - 投注中注单移至侧边悬浮窗
   - 默认收起，显示加载动画
   - 悬浮展开显示详情

### 技术栈
- React 18 + TypeScript
- TailwindCSS + Framer Motion
- 状态机设计

### 交付要求
1. 代码提交到指定分支
2. 实现状态机: idle → submitting → pending → success/failed
3. 创建 Pull Request
""",
        dependencies=["VOI-71", "VOI-72"]
    ),
    SubTask(
        issue_id="VOI-74",
        title="投注拒绝与打回处理",
        branch="zhaoyiyinwinnie/voi-74-feature-投注拒绝与打回处理",
        model="manus-1.6-lite",
        prompt="""
## 任务: VOI-74 - 投注拒绝与打回处理

### 项目背景
实现投注被拒绝后的处理逻辑。

### 功能要求
1. 拒绝原因展示：
   - 赔率已变更
   - 盘口已关闭
   - 余额不足
   - 模拟随机拒绝

2. 注单返回逻辑：
   - 失败注单自动返回
   - 高亮动画效果
   - 视觉引导

3. 冲突处理：
   - 自动合并重复选项
   - 保留最新赔率

### 技术栈
- React 18 + TypeScript
- TailwindCSS + Framer Motion

### 交付要求
1. 代码提交到指定分支
2. 实现优雅的错误处理
3. 创建 Pull Request
""",
        dependencies=["VOI-71", "VOI-72", "VOI-73"]
    ),
    SubTask(
        issue_id="VOI-75",
        title="高级过关功能 (Custom Bet + System Bet + Banker)",
        branch="zhaoyiyinwinnie/voi-75-feature-高级过关功能-custom-bet-system-bet-banker",
        model="manus-1.6",  # 复杂任务，使用标准模型
        prompt="""
## 任务: VOI-75 - 高级过关功能

### 项目背景
实现高级过关功能，这是一个复杂的业务逻辑任务。

### 功能要求

#### 1. Custom Bet (自定义投注)
- 将同一盘口的多个选项合并为"或"关系
- 作为一个 Way 参与过关
- 提供"合并选项"按钮

#### 2. System Bet (系统过关)
- 选项 ≥ 3 时显示系统过关 Tab
- 自动生成所有组合方案
- 例如 4 选项: 2/4 (6注), 3/4 (4注), 4/4 (1注)
- 每种方案独立金额输入

#### 3. Banker (胆码)
- 系统过关模式下可设定 Banker
- 提供"B"或"设为胆码"开关
- Banker 必须包含在所有组合中

#### 4. 组合计算
- 实现 C(n,k) 组合计算
- 计算总注数和总金额
- 计算潜在最大赔付

### 技术栈
- React 18 + TypeScript
- 组合数学算法

### 交付要求
1. 代码提交到指定分支
2. 组合计算准确
3. 创建 Pull Request
""",
        dependencies=["VOI-71", "VOI-72"]
    ),
]


def create_manus_task(task: SubTask, project_id: Optional[str] = None) -> Dict:
    """
    通过 Manus API 创建任务
    """
    headers = {
        "API_KEY": MANUS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    payload = {
        "prompt": task.prompt,
        "agentProfile": task.model,
        "taskMode": "agent",
    }
    
    if project_id:
        payload["projectId"] = project_id
    
    # 添加连接器（如果需要 GitHub 和 Linear 集成）
    # payload["connectors"] = ["github", "linear"]
    
    response = requests.post(
        f"{MANUS_API_BASE}/tasks",
        headers=headers,
        json=payload
    )
    
    return response.json()


def analyze_task_dependencies(tasks: List[SubTask]) -> Dict[str, List[SubTask]]:
    """
    分析任务依赖关系，返回可并行执行的任务组
    """
    # 第一批：无依赖的任务
    batch_1 = [t for t in tasks if not t.dependencies]
    
    # 第二批：依赖第一批的任务
    batch_2 = [t for t in tasks if t.dependencies and all(d in ["VOI-71"] for d in t.dependencies)]
    
    # 第三批：依赖更多任务的
    batch_3 = [t for t in tasks if t not in batch_1 and t not in batch_2]
    
    return {
        "batch_1": batch_1,
        "batch_2": batch_2,
        "batch_3": batch_3
    }


def main():
    """
    主执行函数
    """
    print("=" * 60)
    print("投注单交互系统子任务执行计划")
    print("=" * 60)
    
    # 分析依赖关系
    batches = analyze_task_dependencies(SUBTASKS)
    
    print("\n## 执行批次分析\n")
    
    for batch_name, tasks in batches.items():
        if tasks:
            print(f"### {batch_name.upper()}")
            for task in tasks:
                print(f"  - {task.issue_id}: {task.title} (Model: {task.model})")
            print()
    
    print("\n## 可并行执行的任务\n")
    
    # 第一批可以并行
    print("### Batch 1 (可并行)")
    for task in batches["batch_1"]:
        print(f"  - {task.issue_id}: {task.title}")
    
    # VOI-72 和 VOI-75 可以并行（都只依赖 VOI-71）
    print("\n### Batch 2 (可并行，等待 Batch 1 完成)")
    parallel_tasks = [t for t in SUBTASKS if t.issue_id in ["VOI-72", "VOI-75"]]
    for task in parallel_tasks:
        print(f"  - {task.issue_id}: {task.title}")
    
    # VOI-73 和 VOI-74 需要顺序执行
    print("\n### Batch 3 (顺序执行)")
    sequential_tasks = [t for t in SUBTASKS if t.issue_id in ["VOI-73", "VOI-74"]]
    for task in sequential_tasks:
        print(f"  - {task.issue_id}: {task.title}")
    
    print("\n" + "=" * 60)
    print("模型使用统计")
    print("=" * 60)
    
    lite_count = sum(1 for t in SUBTASKS if t.model == "manus-1.6-lite")
    standard_count = sum(1 for t in SUBTASKS if t.model == "manus-1.6")
    max_count = sum(1 for t in SUBTASKS if t.model == "manus-1.6-max")
    
    print(f"  manus-1.6-lite: {lite_count} 个任务")
    print(f"  manus-1.6:      {standard_count} 个任务")
    print(f"  manus-1.6-max:  {max_count} 个任务")
    
    print("\n成本优化: 80% 任务使用 lite 模型")


if __name__ == "__main__":
    main()
