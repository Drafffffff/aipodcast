'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  DEFAULT_PODCAST_CONFIG,
  TASK_STATUS,
  TASK_TYPE,
  MESSAGES 
} from '@/lib/config/podcast'

export default function Page() {
  const [url, setUrl] = useState(
    '',
  )
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setError(null)

    // 简单校验
    if (!url || !/^https?:\/\//i.test(url)) {
      setError(MESSAGES.ERROR.INVALID_URL)
      return
    }

    setLoading(true)
    try {
      // 1. 先在数据库中插入记录
      const insertRes = await fetch('/api/pod_cast_gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          script_prompt: DEFAULT_PODCAST_CONFIG.scriptPrompt,
          prompt_text_speaker1: DEFAULT_PODCAST_CONFIG.speaker1.text,
          prompt_text_speaker2: DEFAULT_PODCAST_CONFIG.speaker2.text,
          prompt_audio_speaker1: DEFAULT_PODCAST_CONFIG.speaker1.audio,
          prompt_audio_speaker2: DEFAULT_PODCAST_CONFIG.speaker2.audio,
          status: TASK_STATUS.PENDING
        }),
      })

      const insertData = await insertRes.json()
      if (!insertRes.ok) {
        throw new Error(insertData?.error || MESSAGES.ERROR.TASK_CREATION_FAILED)
      }

      const taskId = insertData.data?.id
      if (!taskId) {
        throw new Error(MESSAGES.ERROR.TASK_ID_NOT_FOUND)
      }

      // 2. 再发送到队列
      const task_data = {
        type: TASK_TYPE.TTSD,
        url,
        script_prompt: DEFAULT_PODCAST_CONFIG.scriptPrompt,
        prompt_audio_speaker2: DEFAULT_PODCAST_CONFIG.speaker2.audio,
        prompt_text_speaker2: DEFAULT_PODCAST_CONFIG.speaker2.text,
        prompt_audio_speaker1: DEFAULT_PODCAST_CONFIG.speaker1.audio,
        prompt_text_speaker1: DEFAULT_PODCAST_CONFIG.speaker1.text,
        id: taskId.toString(),
      }

      const queueRes = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_data }),
      })

      const queueData = await queueRes.json()
      if (!queueRes.ok) {
        throw new Error(queueData?.error || MESSAGES.ERROR.QUEUE_SUBMISSION_FAILED)
      }
      
      setMsg(MESSAGES.SUCCESS.TASK_SUBMITTED(taskId.toString()))
    } catch (err) {
      const message = err instanceof Error ? err.message : MESSAGES.ERROR.SUBMIT_FAILED
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">提交播客生成任务</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1">
            URL
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="请输入要转换的文章网址，如：https://example.com/article"
            className="w-full rounded border px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto rounded bg-black text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base disabled:opacity-50"
        >
          {loading ? '提交中…' : '确定'}
        </button>
      </form>
      {msg && (
        <div className="mt-4 text-green-700 text-sm" role="status">
          <p>{msg}</p>
          <Link 
            href="/tasks" 
            className="inline-block mt-2 text-green-800 underline hover:text-green-900"
          >
            查看任务列表 →
          </Link>
        </div>
      )}
      {error && (
        <p className="mt-4 text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}
      <p className="mt-6 text-xs text-gray-500">
        {MESSAGES.INFO.QUEUE_INFO}
      </p>
      <p className="mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded border-l-4 border-blue-300">
        {MESSAGES.INFO.PROCESSING_TIME}
      </p>
    </div>
  )
}
