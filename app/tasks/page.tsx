'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Task {
  id: number
  url: string
  script_prompt?: string
  status: 'pending' | 'done'
  created_at: string
  result_url?: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'done'>('all')
  const pageSize = 10

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      
      const url = `/api/pod_cast_gen?from=${from}&to=${to}`

      const res = await fetch(url)
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || '获取任务列表失败')
      }

      let filteredTasks = result.data || []
      if (statusFilter !== 'all') {
        filteredTasks = filteredTasks.filter((task: Task) => task.status === statusFilter)
      }

      setTasks(filteredTasks)
      setTotal(filteredTasks.length) // 简化版本，实际应该从后端返回总数
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取任务列表失败'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  function getStatusBadge(status: string) {
    const baseClasses = 'px-2 py-1 text-xs rounded-full font-medium'
    if (status === 'pending') {
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    }
    if (status === 'done') {
      return `${baseClasses} bg-green-100 text-green-800`
    }
    return `${baseClasses} bg-gray-100 text-gray-800`
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  function truncateUrl(url: string, maxLength = 50) {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
  }

  if (loading && tasks.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
            <p className="text-gray-600">正在加载任务列表...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">任务列表</h1>
        <Link
          href="/ttsd"
          className="rounded bg-black px-4 py-2 text-center text-sm sm:text-base text-white hover:bg-gray-800"
        >
          新建任务
        </Link>
      </div>

      {/* 筛选器 */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1 rounded text-sm ${
            statusFilter === 'all'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1 rounded text-sm ${
            statusFilter === 'pending'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          处理中
        </button>
        <button
          onClick={() => setStatusFilter('done')}
          className={`px-3 py-1 rounded text-sm ${
            statusFilter === 'done'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          已完成
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-600 text-sm" role="alert">
          {error}
        </div>
      )}

      {/* 任务列表 */}
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">暂无任务</p>
          <Link
            href="/ttsd"
            className="inline-block rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            创建第一个任务
          </Link>
        </div>
      ) : (
        <>
          {/* 桌面端表格视图 */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900" title={task.url}>
                        {truncateUrl(task.url)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={getStatusBadge(task.status)}>
                        {task.status === 'pending' ? '处理中' : '已完成'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDate(task.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/tasks/${task.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        查看详情
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 移动端卡片视图 */}
          <div className="md:hidden space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate" title={task.url}>
                      {truncateUrl(task.url)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(task.created_at)}
                    </div>
                  </div>
                  <span className={getStatusBadge(task.status)}>
                    {task.status === 'pending' ? '处理中' : '已完成'}
                  </span>
                </div>
                <div className="flex justify-end">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="text-black hover:text-gray-700 text-sm font-medium"
                  >
                    查看详情 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 分页 */}
      {tasks.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-500">
            共 {total} 条记录
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一页
            </button>
            <span className="px-3 py-2 text-sm">
              第 {page} 页
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={tasks.length < pageSize}
              className="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
