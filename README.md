This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API 文档

本项目提供两个服务端 API：

1) 按 id 读取 Supabase 表行
- 路径：`GET /api/pod_cast_gen`
- 查询参数：
	- `id` 可选：按主键 `id` 精确筛选
	- `select` 可选：逗号分隔列名，默认 `*`（示例：`some_column,other_column`）
	- `from`、`to` 可选：分页范围（含首尾），示例：`from=0&to=9`
- 成功返回：`{ data: [...] }`
- 失败返回：`{ error: string }`

示例：

```bash
curl "http://localhost:3000/api/pod_cast_gen?id=123&select=title,created_at&from=0&to=9"
```

浏览器/前端调用示例：

```ts
const res = await fetch('/api/pod_cast_gen?id=123&select=title,created_at')
const { data, error } = await res.json()
```

2) 发送队列消息（pgmq）
- 路径：`POST /api/queue`
- 请求体 JSON：
	- `task_data` 对象或使用 `message` 字段（必填，二选一）
	- `queue_name` 可选，默认 `moss_ttsd`
	- `sleep_seconds` 可选，默认 `0`
- 成功返回：`{ data: ... }`（为 RPC 返回数据）
- 失败返回：`{ error: string }`

示例：

```bash
curl -X POST "http://localhost:3000/api/queue" \
	-H 'Content-Type: application/json' \
	-d '{
		"task_data": { "job": "speak", "lang": "zh" },
		"queue_name": "moss_ttsd"
	}'
```

浏览器/前端调用示例：

```ts
const res = await fetch('/api/queue', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ task_data: { job: 'speak', lang: 'zh' } })
})
const { data, error } = await res.json()
```

### 环境变量与安全

将 `.env.example` 复制为 `.env.local` 并填入实际值：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`（仅服务端使用，切勿在客户端或仓库中泄露）

注意：上述 API 路由运行在服务端，使用 Service Role Key 访问数据库与 RPC；请确保你的 Supabase 项目中已启用 `pgmq_public.send` RPC（pgmq 扩展/函数已安装且可用）。

### 本地调试

```bash
npm run dev
# 在另一个终端中调用：
curl "http://localhost:3000/api/pod_cast_gen?select=*&from=0&to=9"
```
