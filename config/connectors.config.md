# Manus连接器配置文档

**更新日期**: 2025-12-26  
**版本**: 1.0

---

## 概述

本文档记录了项目中使用的Manus连接器配置信息。这些连接器使Manus AI能够自动访问外部服务，如GitHub和Linear，实现完全自动化的开发工作流。

---

## 已配置的连接器

### 1. GitHub连接器

**连接器ID**: `bbb0df76-66bd-4a24-ae4f-2aac4750d90b`

**用途**:
- 访问GitHub仓库 `gdszyy/sports-betting-platform`
- 克隆仓库到Manus沙箱环境
- 创建和切换分支
- 提交代码变更
- 创建Pull Request
- 管理Issue和评论

**权限范围**:
- 读取仓库内容
- 创建和管理分支
- 提交代码
- 创建和管理PR
- 读写Issue

**使用场景**:
- 所有需要访问或修改代码的任务
- 自动化代码提交和PR创建
- 代码审查和协作

---

### 2. Linear连接器

**连接器ID**: `982c169d-0c89-4dbd-95fd-30b49cc2f71e`

**用途**:
- 访问Linear workspace `voidzyy`
- 读取Issue详情
- 更新Issue状态
- 添加评论
- 关联GitHub PR
- 管理项目进度

**权限范围**:
- 读取Issue信息
- 更新Issue状态
- 添加评论和附件
- 关联外部链接（如GitHub PR）

**使用场景**:
- 任务完成后自动更新Issue状态
- 添加进度更新和评论
- 关联代码PR到Issue
- 项目管理和追踪

---

## 在Manus API中使用连接器

### 基本用法

在创建任务时，通过 `connectors` 参数传入连接器ID列表：

```python
import requests

payload = {
    "prompt": "你的任务提示词",
    "agentProfile": "manus-1.6-lite",
    "taskMode": "agent",
    "connectors": [
        "bbb0df76-66bd-4a24-ae4f-2aac4750d90b",  # GitHub
        "982c169d-0c89-4dbd-95fd-30b49cc2f71e"   # Linear
    ]
}

headers = {
    "API_KEY": "your-manus-api-key",
    "Content-Type": "application/json"
}

response = requests.post(
    "https://api.manus.ai/v1/tasks",
    headers=headers,
    json=payload
)
```

### 完整示例

```python
import requests
import json

def create_task_with_connectors(prompt, model="manus-1.6-lite"):
    """
    创建带有GitHub和Linear连接器的Manus任务
    
    Args:
        prompt: 任务提示词
        model: 使用的模型（manus-1.6-lite, manus-1.6, manus-1.6-max）
    
    Returns:
        任务创建结果
    """
    MANUS_API_KEY = "your-api-key"
    API_BASE = "https://api.manus.ai/v1"
    
    # 连接器配置
    GITHUB_CONNECTOR_ID = "bbb0df76-66bd-4a24-ae4f-2aac4750d90b"
    LINEAR_CONNECTOR_ID = "982c169d-0c89-4dbd-95fd-30b49cc2f71e"
    
    payload = {
        "prompt": prompt,
        "agentProfile": model,
        "taskMode": "agent",
        "connectors": [GITHUB_CONNECTOR_ID, LINEAR_CONNECTOR_ID]
    }
    
    headers = {
        "API_KEY": MANUS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/tasks",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 任务创建成功！")
            print(f"任务ID: {result.get('task_id')}")
            print(f"任务URL: {result.get('task_url')}")
            return result
        else:
            print(f"❌ 任务创建失败: {response.status_code}")
            print(response.text)
            return None
            
    except Exception as e:
        print(f"❌ 错误: {str(e)}")
        return None

# 使用示例
prompt = """
实现投注单基础框架功能...
"""

result = create_task_with_connectors(prompt, model="manus-1.6-lite")
```

---

## 连接器工作流程

### GitHub连接器工作流

1. **任务开始**
   - Manus AI接收任务提示词
   - 识别需要访问GitHub仓库

2. **仓库访问**
   - 使用GitHub连接器克隆仓库
   - 切换到main分支

3. **分支创建**
   - 根据任务要求创建新分支
   - 命名格式：`username/issue-id-feature-description`

4. **代码开发**
   - 阅读相关文档
   - 实现功能
   - 编写测试

5. **代码提交**
   - 提交代码到分支
   - 使用规范的commit message

6. **PR创建**
   - 创建Pull Request
   - 填写PR描述
   - 关联Linear Issue

### Linear连接器工作流

1. **Issue读取**
   - 获取Issue详情
   - 理解任务需求

2. **进度更新**
   - 任务开始时添加评论
   - 定期更新进度

3. **状态变更**
   - 任务完成后更新状态为Done
   - 关联GitHub PR链接

4. **协作通知**
   - 通知相关团队成员
   - 添加完成总结

---

## 安全注意事项

### 1. 连接器ID保护

⚠️ **重要**: 连接器ID应被视为敏感信息

- ✅ **可以**: 在项目内部文档中记录
- ✅ **可以**: 在私有仓库中存储
- ❌ **不要**: 在公开仓库中暴露
- ❌ **不要**: 在公开文档中分享

### 2. 权限管理

- 定期审查连接器权限
- 遵循最小权限原则
- 及时撤销不再使用的连接器

### 3. 访问控制

- 仅授权可信的团队成员访问
- 使用环境变量存储敏感信息
- 不要在代码中硬编码连接器ID

---

## 故障排查

### 问题1: 连接器无法访问GitHub仓库

**可能原因**:
- 连接器权限不足
- 仓库不存在或已删除
- GitHub账户未授权

**解决方案**:
1. 检查连接器配置
2. 验证GitHub仓库访问权限
3. 重新授权GitHub连接器

### 问题2: Linear Issue无法更新

**可能原因**:
- 连接器权限不足
- Issue ID错误
- Linear workspace访问受限

**解决方案**:
1. 确认Linear连接器权限
2. 验证Issue ID正确性
3. 检查workspace访问权限

### 问题3: 任务创建失败

**可能原因**:
- 连接器ID错误
- API Key无效
- 网络连接问题

**解决方案**:
1. 验证连接器ID格式
2. 检查API Key有效性
3. 测试网络连接

---

## 最佳实践

### 1. 任务提示词设计

在提示词中明确说明：
- 需要访问的GitHub仓库
- 需要更新的Linear Issue
- 期望的分支命名
- PR创建要求

### 2. 连接器使用

- 仅在需要时启用连接器
- 避免过度授权
- 定期审查使用情况

### 3. 自动化流程

- 设计清晰的工作流程
- 定义明确的验收标准
- 建立代码审查机制

---

## 相关资源

- [Manus API文档](docs/.knowledge/ManusAPI功能汇总文档.md)
- [任务执行日志](../TASK_EXECUTION_LOG.md)
- [任务执行指南](../docs/.knowledge/TASK_EXECUTION_GUIDE.md)
- [GitHub仓库](https://github.com/gdszyy/sports-betting-platform)
- [Linear项目](https://linear.app/voidzyy/project/sports-betting-platform-b6c75c6e7fb5)

---

## 更新历史

| 日期 | 版本 | 更新内容 |
| :--- | :--- | :--- |
| 2025-12-26 | 1.0 | 初始版本，记录GitHub和Linear连接器配置 |

---

**维护者**: Manus AI  
**联系方式**: 通过GitHub Issue或Linear提问
