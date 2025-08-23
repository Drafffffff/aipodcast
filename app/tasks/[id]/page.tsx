'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Task {
  id: number
  url: string
  script_prompt?: string
  prompt_text_speaker1?: string
  prompt_text_speaker2?: string
  prompt_audio_speaker1?: string
  prompt_audio_speaker2?: string
  status: 'pending' | 'done'
  created_at: string
  result_url?: string
  script?: string
}

export default function TaskDetailPage() {
  const params = useParams()
  const taskId = params.id as string
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)

  const fetchTask = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pod_cast_gen?id=${taskId}`)
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || '获取任务详情失败')
      }

      if (result.data && result.data.length > 0) {
        setTask(result.data[0])
      } else {
        throw new Error('任务不存在')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取任务详情失败'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    if (taskId) {
      fetchTask()
    }
  }, [taskId, fetchTask])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [task?.result_url])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  function handlePlaybackRateChange(rate: number) {
    const audio = audioRef.current
    if (!audio) return

    audio.playbackRate = rate
    setPlaybackRate(rate)
  }

  function formatTime(seconds: number) {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  function getStatusBadge(status: string) {
    const baseClasses = 'px-3 py-1 text-sm rounded-full font-medium'
    if (status === 'pending') {
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    }
    if (status === 'done') {
      return `${baseClasses} bg-green-100 text-green-800`
    }
    return `${baseClasses} bg-gray-100 text-gray-800`
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
            <p className="text-gray-600">正在加载任务详情...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/tasks"
            className="inline-block rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            返回列表
          </Link>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">任务不存在</p>
          <Link
            href="/tasks"
            className="inline-block rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            返回列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      {/* 导航 */}
      <div className="mb-6">
        <Link
          href="/tasks"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← 返回任务列表
        </Link>
      </div>

      {/* 任务基本信息 */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">任务详情</h1>
          <span className={getStatusBadge(task.status)}>
            {task.status === 'pending' ? '处理中' : '已完成'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <div className="text-sm text-gray-900 break-all">
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {task.url}
              </a>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              创建时间
            </label>
            <div className="text-sm text-gray-900">
              {formatDate(task.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* 音频播放器 - 仅在已完成且有音频文件时显示 */}
      {task.status === 'done' && task.result_url && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">播客音频</h2>
          
          <audio
            ref={audioRef}
            src={task.result_url}
            preload="metadata"
            className="hidden"
          />

          <div className="space-y-4">
            {/* 播放控制 */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={togglePlay}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 flex-shrink-0"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            {/* 倍速控制 */}
            <div className="flex items-center gap-2 text-sm">
              <label className="text-gray-700 flex-shrink-0">倍速:</label>
              <div className="flex gap-1 flex-wrap">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={`px-2 py-1 text-xs rounded ${
                      playbackRate === rate
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* 下载链接 */}
            <div>
              <a
                href={task.result_url}
                download
                className="inline-block text-blue-600 hover:text-blue-800 text-sm"
              >
                下载音频文件
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 处理中状态 */}
      {task.status === 'pending' && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">处理状态</h2>
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">正在生成播客内容，请稍候...</span>
          </div>
        </div>
      )}

      {/* 文本稿 - 仅在有内容时显示 */}
      {task.script && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">播客文稿</h2>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed overflow-x-auto">
              {task.script}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
