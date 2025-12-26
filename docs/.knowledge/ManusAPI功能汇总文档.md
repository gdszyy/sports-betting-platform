
**作者：** Manus AI
**日期：** 2025年12月20日

## 摘要

Manus API（Manus Integrations API）旨在允许开发者将 Manus 作为一个完整的 **AI 智能体**无缝集成到其工作流程中。它提供了一套全面的 RESTful 接口，用于管理项目、创建和控制 AI 任务、处理文件以及接收实时通知。

## 核心功能概览

Manus API 的核心功能围绕以下四个主要资源展开：**项目 (Projects)**、**任务 (Tasks)**、**文件 (Files)** 和 **Webhooks**。

| 资源类别 | 主要用途 | 关键 API 端点 |
| :--- | :--- | :--- |
| **Projects** (项目) | 组织任务，并为项目内的所有任务应用一致的默认指令。 | `POST /v1/projects` (创建项目) |
| **Tasks** (任务) | 创建、查询、更新和删除 AI 智能体任务。这是 API 的核心，用于触发 AI 工作。 | `POST /v1/tasks` (创建任务) |
| **Files** (文件) | 上传和管理任务所需的附件，支持文件 ID、URL 或 Base64 数据作为附件。 | `POST /v1/files` (创建文件) |
| **Webhooks** (网络钩子) | 注册 Webhook 以接收任务生命周期事件的实时通知。 | `POST /v1/webhooks` (创建 Webhook) |

## API 基础信息与认证

### 基础 API 域名

Manus API 的基础 URL 为：`https://api.manus.ai/v1`

所有 API 请求都应以此为前缀。

### 认证方式

API 认证通过在请求头中传递 `API_KEY` 实现。

*   **请求头:** `API_KEY: <your-api-key>`
*   **API Key 格式:** API Key 以 `sk-` 开头，例如：`sk-Uoa0Zeqa00SJseTT2HouC5azQ0QjIBgNeu4xo7Mb0Z7zyGPWo-XW4e9XYbXcnX6hAi4GXALz1zknai2QFx42pqPjtlf2`。

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
| `DEL` | `/v1/tasks/{task_id}` | 删除任务。 |

#### 示例：创建任务

以下是使用 `curl` 创建一个简单任务的示例：

```bash
curl --request POST \
  --url 'https://api.manus.ai/v1/tasks' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header "API_KEY: $MANUS_API_KEY" \
  --data '{
    "prompt": "hello"
  }'
```

#### 核心参数 (`POST /v1/tasks`)

*   **`prompt`** (必需): 给予 Manus 智能体的任务指令或提示。
*   **`agentProfile`** (必需): 指定用于执行任务的 AI 模型配置，例如 `manus-1.6`、`manus-1.6-lite` 或 `manus-1.6-max`。
*   **`attachments`**: 任务附件数组，支持通过 **文件 ID**、**URL** 或 **Base64 数据** 三种方式提供文件或图像。
*   **`taskMode`**: 任务模式，可选 `chat` (聊天)、`adaptive` (自适应) 或 `agent` (智能体)。
*   **`projectId`**: 将任务关联到特定项目，从而自动应用项目级别的默认指令。
*   **`connectors`**: 启用已在用户账户中配置的连接器 ID 列表，以允许 AI 智能体访问外部服务。

### 2. 项目 API (Projects API)

项目 API 用于组织任务并设置项目级别的默认行为。

#### 关键操作

| HTTP 方法 | 端点 | 描述 |
| :--- | :--- | :--- |
| `POST` | `/v1/projects` | **创建新项目**，用于组织任务和应用一致的指令。 |
| `GET` | `/v1/projects` | 列出所有项目。 |

#### 核心参数 (`POST /v1/projects`)

*   **`name`** (必需): 项目名称。
*   **`instruction`**: 默认指令，将自动应用于该项目下创建的所有任务。

### 3. 文件 API (Files API)

文件 API 允许用户上传和管理任务所需的输入文件。

#### 关键操作

| HTTP 方法 | 端点 | 描述 |
| :--- | :--- | :--- |
| `POST` | `/v1/files` | **创建新文件**，上传文件以供任务使用。 |