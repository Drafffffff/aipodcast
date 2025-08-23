# 播客配置文档

## 概述

这个文件包含了播客生成应用的所有配置常量，用于集中管理和维护项目中的各种配置项。

## 配置项说明

### 播客生成配置

- `SCRIPT_PROMPT`: 播客脚本生成的详细提示词
- `PROMPT_AUDIO_SPEAKER1/2`: 主持人1和2的音频提示链接
- `PROMPT_TEXT_SPEAKER1/2`: 主持人1和2的文本提示内容

### 任务状态

- `TASK_STATUS.PENDING`: 待处理
- `TASK_STATUS.PROCESSING`: 处理中
- `TASK_STATUS.COMPLETED`: 已完成
- `TASK_STATUS.FAILED`: 失败
- `TASK_STATUS.DONE`: 已完成（向后兼容）

### 任务类型

- `TASK_TYPE.TTSD`: TTS对话生成类型

### 消息配置

- `MESSAGES.SUCCESS`: 成功消息
- `MESSAGES.ERROR`: 错误消息  
- `MESSAGES.INFO`: 信息提示
- `MESSAGES.STATUS_DISPLAY`: 状态显示文本

### 使用示例

```typescript
import { 
  DEFAULT_PODCAST_CONFIG,
  TASK_STATUS,
  MESSAGES,
  getStatusDisplayText 
} from '@/lib/config/podcast'

// 使用默认配置
const config = DEFAULT_PODCAST_CONFIG

// 使用状态常量
if (task.status === TASK_STATUS.PENDING) {
  // 处理待处理状态
}

// 显示状态文本
const statusText = getStatusDisplayText(task.status)

// 使用消息常量
setError(MESSAGES.ERROR.INVALID_URL)
```

## 修改配置

如需修改配置，请直接编辑 `lib/config/podcast.ts` 文件，所有引用该配置的组件将自动更新。

## 文件位置

- 配置文件：`lib/config/podcast.ts`
- 使用该配置的文件：
  - `app/ttsd/page.tsx`
  - `app/tasks/page.tsx`
  - `app/tasks/[id]/page.tsx`
