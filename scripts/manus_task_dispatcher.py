#!/usr/bin/env python3
"""
Manus Task Dispatcher - 智能任务分派脚本

本脚本实现了从 Linear Backlog 自动拉取任务，评估难度，并分派给合适的 Manus Agent 模型。

使用方法:
    python manus_task_dispatcher.py [--force-profile <profile>] [--dry-run]

参数:
    --force-profile: 强制使用指定的模型配置 (lite/standard/max)
    --dry-run: 仅模拟运行，不实际创建任务
"""

import os
import json
import argparse
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

# 模型配置
class AgentProfile(Enum):
    LITE = "manus-1.6-lite"
    STANDARD = "manus-1.6"
    MAX = "manus-1.6-max"


@dataclass
class DifficultyFactors:
    """任务难度评估因子"""
    code_lines: int  # 预估代码行数
    dependencies: int  # 依赖系统数量
    logic_complexity: str  # 业务逻辑复杂度: low/medium/high
    innovation: str  # 创新性要求: low/medium/high


@dataclass
class LinearIssue:
    """Linear Issue 数据结构"""
    id: str
    identifier: str
    title: str
    description: str
    priority: int
    state: str
    git_branch_name: str
    project_id: str


class TaskDispatcher:
    """任务分派器"""
    
    # 难度评估权重
    WEIGHTS = {
        "code_lines": 0.20,
        "dependencies": 0.25,
        "logic_complexity": 0.30,
        "innovation": 0.25
    }
    
    # 复杂度映射
    COMPLEXITY_SCORES = {
        "low": 1,
        "medium": 2,
        "high": 3
    }
    
    def __init__(self, manus_api_key: str, force_profile: Optional[str] = None):
        self.manus_api_key = manus_api_key
        self.force_profile = force_profile
        self.knowledge_base_path = "docs/.knowledge/"
    
    def evaluate_difficulty(self, factors: DifficultyFactors) -> float:
        """
        评估任务难度，返回 0-1 之间的分数
        """
        # 代码行数评分
        if factors.code_lines < 100:
            code_score = 1
        elif factors.code_lines < 500:
            code_score = 2
        else:
            code_score = 3
        
        # 依赖系统评分
        if factors.dependencies == 1:
            dep_score = 1
        elif factors.dependencies <= 3:
            dep_score = 2
        else:
            dep_score = 3
        
        # 逻辑复杂度评分
        logic_score = self.COMPLEXITY_SCORES.get(factors.logic_complexity, 2)
        
        # 创新性评分
        innovation_score = self.COMPLEXITY_SCORES.get(factors.innovation, 2)
        
        # 加权计算
        total_score = (
            code_score * self.WEIGHTS["code_lines"] +
            dep_score * self.WEIGHTS["dependencies"] +
            logic_score * self.WEIGHTS["logic_complexity"] +
            innovation_score * self.WEIGHTS["innovation"]
        )
        
        # 归一化到 0-1
        return (total_score - 1) / 2
    
    def select_model(self, difficulty: float) -> AgentProfile:
        """
        根据难度选择合适的模型
        """
        if self.force_profile:
            profile_map = {
                "lite": AgentProfile.LITE,
                "standard": AgentProfile.STANDARD,
                "max": AgentProfile.MAX
            }
            return profile_map.get(self.force_profile, AgentProfile.LITE)
        
        if difficulty < 0.4:
            return AgentProfile.LITE
        elif difficulty < 0.7:
            return AgentProfile.STANDARD
        else:
            return AgentProfile.MAX
    
    def load_knowledge_context(self, issue: LinearIssue) -> str:
        """
        根据任务内容加载相关知识库文档
        """
        context_parts = []
        
        # 始终加载交接文档
        handover_path = os.path.join(self.knowledge_base_path, "HANDOVER_DOCUMENT.md")
        if os.path.exists(handover_path):
            with open(handover_path, "r", encoding="utf-8") as f:
                context_parts.append(f"## 交接文档\n\n{f.read()}")
        
        # 根据任务标题关键词加载相关文档
        title_lower = issue.title.lower()
        
        if "盘口" in title_lower or "market" in title_lower:
            tab_chip_path = os.path.join(self.knowledge_base_path, "体育盘口Tab&Chip分类规则文档.md")
            if os.path.exists(tab_chip_path):
                with open(tab_chip_path, "r", encoding="utf-8") as f:
                    context_parts.append(f"## Tab & Chip 分类规则\n\n{f.read()}")
        
        if "api" in title_lower or "接口" in title_lower:
            # 加载 API 相关文档
            pass
        
        return "\n\n---\n\n".join(context_parts)
    
    def build_prompt(self, issue: LinearIssue, knowledge_context: str) -> str:
        """
        构建任务提示词
        """
        prompt = f"""# 任务: {issue.title}

## Linear Issue
- ID: {issue.identifier}
- 分支: {issue.git_branch_name}

## 任务描述
{issue.description}

## 知识库上下文
{knowledge_context}

## 执行协议

### 第一步: 理解需求
1. 仔细阅读任务描述和验收标准
2. 查阅知识库上下文中的相关文档
3. 如有疑问，在代码注释中说明假设

### 第二步: 实现功能
1. 创建功能分支: `git checkout -b {issue.git_branch_name}`
2. 编写代码，遵循项目代码规范
3. 确保代码通过 TypeScript 类型检查

### 第三步: 提交代码
1. 提交代码: `git commit -m "feat({issue.identifier}): 完成{issue.title}"`
2. 推送分支: `git push origin {issue.git_branch_name}`
3. 创建 Pull Request，关联 Linear Issue

### 第四步: 更新文档
1. 更新 HANDOVER_DOCUMENT.md 中的进度
2. 记录任何新的设计决策

## 完成标准
- 代码通过 TypeScript 类型检查
- 功能符合验收标准
- 交接文档已更新
"""
        return prompt
    
    def create_manus_task(self, prompt: str, profile: AgentProfile, dry_run: bool = False) -> Optional[str]:
        """
        创建 Manus 任务
        """
        if dry_run:
            print(f"[DRY RUN] Would create task with profile: {profile.value}")
            print(f"[DRY RUN] Prompt preview:\n{prompt[:500]}...")
            return "dry-run-task-id"
        
        # 实际 API 调用
        import requests
        
        response = requests.post(
            "https://api.manus.ai/v1/tasks",
            headers={
                "API_KEY": self.manus_api_key,
                "Content-Type": "application/json"
            },
            json={
                "prompt": prompt,
                "agentProfile": profile.value,
                "taskMode": "agent"
            }
        )
        
        if response.status_code == 200:
            return response.json().get("id")
        else:
            print(f"Error creating task: {response.text}")
            return None
    
    def dispatch(self, issue: LinearIssue, factors: DifficultyFactors, dry_run: bool = False) -> Dict:
        """
        执行任务分派
        """
        # 评估难度
        difficulty = self.evaluate_difficulty(factors)
        
        # 选择模型
        profile = self.select_model(difficulty)
        
        # 加载知识库上下文
        knowledge_context = self.load_knowledge_context(issue)
        
        # 构建提示词
        prompt = self.build_prompt(issue, knowledge_context)
        
        # 创建任务
        task_id = self.create_manus_task(prompt, profile, dry_run)
        
        return {
            "issue_id": issue.identifier,
            "difficulty": difficulty,
            "profile": profile.value,
            "task_id": task_id
        }


def main():
    parser = argparse.ArgumentParser(description="Manus Task Dispatcher")
    parser.add_argument("--force-profile", choices=["lite", "standard", "max"],
                        help="强制使用指定的模型配置")
    parser.add_argument("--dry-run", action="store_true",
                        help="仅模拟运行，不实际创建任务")
    args = parser.parse_args()
    
    # 获取 API Key
    manus_api_key = os.environ.get("MANUS_API_KEY")
    if not manus_api_key and not args.dry_run:
        print("Error: MANUS_API_KEY environment variable not set")
        return
    
    # 创建分派器
    dispatcher = TaskDispatcher(
        manus_api_key=manus_api_key or "dry-run-key",
        force_profile=args.force_profile
    )
    
    # 示例: 分派一个任务
    example_issue = LinearIssue(
        id="example-id",
        identifier="VOI-66",
        title="[Feature] 比赛导航模块开发",
        description="实现三级联动的比赛导航功能",
        priority=3,
        state="Backlog",
        git_branch_name="feature/voi-66-match-navigation",
        project_id="sports-betting-platform"
    )
    
    example_factors = DifficultyFactors(
        code_lines=200,
        dependencies=2,
        logic_complexity="medium",
        innovation="low"
    )
    
    result = dispatcher.dispatch(example_issue, example_factors, args.dry_run)
    print(f"Dispatch result: {json.dumps(result, indent=2)}")


if __name__ == "__main__":
    main()
