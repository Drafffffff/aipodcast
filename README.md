# �📚 无敌念书王

一个基于 AI 的智能播客生成工具，能够将网页内容转换为高质量的播客音频。

## 🌟 主要功能

- **智能内容抓取**：输入网页URL，自动提取并分析内容
- **AI播客生成**：使用先进的AI技术生成自然流畅的播客对话
- **实时任务管理**：查看任务进度，支持状态筛选和分页
- **音频播放器**：内置播放器支持倍速播放、进度控制
- **响应式设计**：完美适配桌面端和移动端
- **现代化界面**：简洁优雅的黑白主题设计

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 环境配置

将 `.env.example` 复制为 `.env.local` 并填入实际值：

```bash
cp .env.example .env.local
```

配置以下环境变量：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 开始使用。

## 📱 使用指南

1. **创建任务**：点击"新建任务"，输入想要转换的网页URL
2. **等待处理**：AI将自动分析内容并生成播客音频
3. **播放收听**：在任务列表中查看完成的任务，点击"查看详情"即可播放
4. **下载音频**：支持下载生成的播客音频文件

## 🛠 技术栈

- **前端框架**：Next.js 15.5.0 + React 19
- **样式方案**：Tailwind CSS
- **数据库**：Supabase (PostgreSQL)
- **开发语言**：TypeScript
- **构建工具**：Turbopack
- **UI组件**：自定义响应式组件

## 📋 API 接口

### 任务管理 API

**获取任务列表**
```http
GET /api/pod_cast_gen?from=0&to=9
```

**按ID获取任务**
```http
GET /api/pod_cast_gen?id=123
```

**创建新任务**
```http
POST /api/pod_cast_gen
Content-Type: application/json

{
  "url": "https://example.com/article",
  "script_prompt": "请生成一个轻松有趣的播客对话",
  "prompt_text_speaker1": "主持人1的设定",
  "prompt_text_speaker2": "主持人2的设定"
}
```

### 队列处理 API

**发送处理任务**
```http
POST /api/queue
Content-Type: application/json

{
  "task_data": {
    "job": "generate_podcast",
    "url": "https://example.com/article"
  },
  "queue_name": "moss_ttsd"
}
```

## 🎨 界面特色

- **简洁设计**：黑白配色方案，突出内容
- **响应式布局**：桌面端表格视图，移动端卡片视图
- **实时状态**：任务状态实时更新，支持处理中/已完成筛选
- **优雅交互**：流畅的动画效果和用户反馈

## 📝 开发说明

### 项目结构

```
app/
├── api/              # API路由
│   ├── pod_cast_gen/ # 任务管理API
│   └── queue/        # 队列处理API
├── components/       # 可复用组件
├── tasks/           # 任务相关页面
├── ttsd/            # 任务创建页面
└── globals.css      # 全局样式

lib/
└── supabase/        # Supabase客户端配置
```

### 开发命令

```bash
# 开发环境
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 运行测试
npm run test
```

## 🔧 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量
4. 部署完成

### 手动部署

```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建新的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Supabase](https://supabase.com/) - 开源后端即服务
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Vercel](https://vercel.com/) - 部署和托管平台

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/your-username/aipodcast/issues)
- 发送邮件至：your-email@example.com

---

**让每个网页都变成精彩的播客内容！** 🎧✨
