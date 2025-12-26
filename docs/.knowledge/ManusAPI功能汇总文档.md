# Manus API 功能汇总文档（修订版）

**作者：** Manus AI
**日期：** 2025年12月26日

## 摘要

Manus API（Manus Integrations API）旨在允许开发者将 Manus 作为一个完整的 **AI 智能体**无缝集成到其工作流程中。它提供了一套全面的 RESTful 接口，用于管理项目、创建和控制 AI 任务、处理文件、接收实时通知，并深度兼容 OpenAI SDK，为开发者提供了极大的灵活性。

本文档基于官方文档对原有内容进行了全面的纠错和补充，新增了 **OpenAI SDK 兼容性**、**连接器 (Connectors)** 和 **Webhook 安全**等关键章节，并修正了文件上传流程等核心功能的描述。

## 核心功能概览

Manus API 的核心功能围绕以下几个主要资源展开：**项目 (Projects)**、**任务 (Tasks)**、**文件 (Files)** 和 **Webhooks**。

| 资源类别 | 主要用途 | 关键 API 端点 |
| :--- | :--- | :--- |
| **Projects** (项目) | 组织任务，并为项目内的所有任务应用一致的默认指令。 | `POST /v1/projects` (创建项目) |
| **Tasks** (任务) | 创建、查询、更新和删除 AI 智能体任务。这是 API 的核心，用于触发 AI 工作。 | `POST /v1/tasks` (创建任务) |
| **Files** (文件) | 上传和管理任务所需的附件。 | `POST /v1/files` (创建文件记录) |
| **Webhooks** (网络钩子) | 注册 Webhook 以接收任务生命周期事件的实时通知。 | `POST /v1/webhooks` (创建 Webhook) |

## API 基础信息与认证

### 基础 API 域名

Manus API 的基础 URL 为：`https://api.manus.ai/v1`

所有 API 请求都应以此为前缀。

### 认证方式

API 认证通过在请求头中传递 `API_KEY` 实现。请注意，API Key 是账户的重要凭证，请妥善保管，切勿在客户端代码或公开仓库中泄露。

*   **请求头:** `API_KEY: <your-api-key>`
*   **API Key 格式:** API Key 以 `sk-` 开头。
*   **示例 API Key:** `sk-Uoa0Zeqa00SJseTT2HouC5azQ0QjIBgNeu4xo7Mb0Z7zyGPWo-XW4e9XYbXcnX6hAi4GXALz1zknai2QFx42pqPjtlf2` (这是一个示例 Key，请替换为你自己的有效 Key)

## 详细 API 组分析

### 1. 任务 API (Tasks API)

任务 API 是触发和管理 AI 智能体工作的核心接口。

#### 关键操作

| HTTP 方法 | 端点 | 描述 |
| :--- | :--- | :--- |
| `POST` | `/v1/tasks` | **创建新 AI 任务**，可包含自定义参数和附件。 |
| `GET` | `/v1/tasks` | 列出所有任务。 |
| `GET` | `/v1/tasks/{task_id}` | 获取特定任务的详细信息。 |
| `PUT` | `/v1/tasks/{task_id}` | 更新现有任务（例如，继续多轮对话）。 |
| `DELETE` | `/v1/tasks/{task_id}` | 删除任务。 |

#### 核心参数 (`POST /v1/tasks`)

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `prompt` | string | 是 | 给予 Manus 智能体的任务指令或提示。 |
| `agentProfile` | enum | 是 | 指定用于执行任务的 AI 模型配置。**可用枚举值**: `manus-1.6`, `manus-1.6-lite`, `manus-1.6-max`。 |
| `attachments` | array | 否 | 任务附件数组，支持通过 **文件 ID**、**URL** 或 **Base64 数据** 三种方式提供文件或图像。 |
| `taskMode` | enum | 否 | 任务模式，可选 `chat` (聊天)、`adaptive` (自适应) 或 `agent` (智能体)。 |
| `projectId` | string | 否 | 将任务关联到特定项目，从而自动应用项目级别的默认指令。 |
| `connectors` | array | 否 | 启用已在用户账户中配置的连接器 ID 列表，以允许 AI 智能体访问外部服务。 |
| `hideInTaskList` | boolean | 否 | 是否在 Manus WebApp 的任务列表中隐藏此任务。 |
| `createShareableLink` | boolean | 否 | 是否创建可公开访问的分享链接。 |
| `taskId` | string | 否 | 用于继续现有的多轮对话任务。 |
| `interactiveMode` | boolean | 否 | 启用交互模式，允许 Manus 在输入不足时提出追问。默认为 `false`。 |
| `locale` | string | 否 | 指定地区，例如 `en-US` 或 `zh-CN`。 |

### 2. 项目 API (Projects API)

项目 API 用于组织任务并设置项目级别的默认行为。

#### 核心参数 (`POST /v1/projects`)

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `name` | string | 是 | 项目名称。 |
| `instruction` | string | 否 | 默认指令，将自动应用于该项目下创建的所有任务。 |

### 3. 文件 API (Files API)

文件 API 允许用户上传和管理任务所需的输入文件。**注意：** 文件上传是一个两步过程。

1.  **创建文件记录**: 发送 `POST /v1/files` 请求，提供文件名，API 将返回一个用于上传的 `upload_url` 和一个 `file_id`。
2.  **上传文件内容**: 使用 `PUT` 方法将文件二进制内容上传到获取到的 `upload_url`。

#### 关键操作

| HTTP 方法 | 端点 | 描述 |
| :--- | :--- | :--- |
| `POST` | `/v1/files` | **创建文件记录**，获取用于上传的预签名 URL。 |

### 4. Webhooks API

Webhooks 用于在任务状态发生变化时接收实时通知。

#### 关键操作

| HTTP 方法 | 端点 | 描述 |
| :--- | :--- | :--- |
| `POST` | `/v1/webhooks` | **创建新 Webhook**，注册一个 URL 以接收事件通知。 |
| `DELETE` | `/v1/webhooks/{webhook_id}` | 删除已注册的 Webhook。 |

## 新增核心功能

### OpenAI SDK 兼容性

Manus API 提供了与 OpenAI Responses API 的兼容层，允许开发者直接使用 OpenAI 的 Python SDK 来调用 Manus。这极大地降低了集成成本，只需修改少量代码即可从 OpenAI 切换到 Manus。

**配置示例：**

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.manus.im",
    api_key="**",  # 此处可为任意占位符
    default_headers={
        "API_KEY": "YOUR_MANUS_API_KEY"  # 填入你的 Manus API Key
    },
)
```

### 连接器 (Connectors)

连接器允许 Manus 访问和操作你在其他平台上的数据和功能，例如 Gmail、Google Calendar、Notion 等。你可以在 Manus 账户中通过 OAuth 安全地授权这些连接，然后在创建任务时通过 `connectors` 参数传入相应的连接器 ID，从而赋予 AI 智能体与这些外部服务交互的能力。

**常用连接器 UUID 示例:**

| 连接器 | UUID |
| :--- | :--- |
| GitHub | `bbb0df76-66bd-4a24-ae4f-2aac4750d90b` |
| Linear | `982c169d-0c89-4dbd-95fd-30b49cc2f71e` |

### Webhook 安全

为确保你的 Webhook 端点安全，Manus 对发出的每一个请求都进行了 **RSA-SHA256** 数字签名。你可以在收到请求时，使用 Manus 提供的公钥对请求头中的 `X-Webhook-Signature` 和 `X-Webhook-Timestamp` 进行验证，以确保请求的合法性，防止重放攻击和恶意调用。

## 调用案例：创建并集成连接器的任务

以下是一个使用 `curl` 创建任务的成功调用案例。该任务指令 AI 分析一个 GitHub 仓库，并将分析结果记录到 Linear 中。

- **目标**: 分析 `gdszyy/sports-betting-platform` 仓库的结构，并在 Linear 中创建一个标题为 "Analyze sports-betting-platform repo" 的 Issue。
- **所用连接器**: GitHub, Linear

```bash
curl --request POST \
  --url 'https://api.manus.ai/v1/tasks' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header "API_KEY: sk-Uoa0Zeqa00SJseTT2HouC5azQ0QjIBgNeu4xo7Mb0Z7zyGPWo-XW4e9XYbXcnX6hAi4GXALz1zknai2QFx42pqPjtlf2" \
  --data '{
    "prompt": "Please analyze the structure of the gdszyy/sports-betting-platform repository and create an issue in Linear with the title \"Analyze sports-betting-platform repo\" and a summary of your findings.",
    "agentProfile": "manus-1.6-max",
    "connectors": [
      "bbb0df76-66bd-4a24-ae4f-2aac4750d90b",
      "982c169d-0c89-4dbd-95fd-30b49cc2f71e"
    ]
  }'
```

### 预期成功响应

```json
{
  "task_id": "<string>",
  "task_title": "<string>",
  "task_url": "<string>",
  "share_url": "<string>"
}
```

## 最佳实践：成本节省原则

为了优化 API 调用成本，建议遵循以下模型选择策略：

1.  **任务解耦优先**: 尽可能将复杂的大任务分解为多个独立的小任务。
2.  **为小任务使用轻量模型**: 对于解耦后的简单、独立的子任务（如数据提取、格式转换等），优先使用 `manus-1.6-lite` 模型，以最低的成本快速完成。
3.  **为整合任务使用标准模型**: 对于需要协调和整合多个子任务结果的“整合”型任务，使用 `manus-1.6` 模型，在成本和性能之间取得平衡。
4.  **为复杂任务保留旗舰模型**: 仅当任务极其复杂且无法有效解耦时，才使用 `manus-1.6-max` 模型。该模型能力最强，但成本也最高，应保留用于最关键、最困难的场景。

通过合理的任务分解和模型选择，可以在保证任务质量的同时，显著降低 API 使用成本。

## 参考文献

[1] Manus API Documentation. [https://open.manus.ai/docs](https://open.manus.ai/docs)
