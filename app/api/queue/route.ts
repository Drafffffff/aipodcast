import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// POST /api/queue { task_data: object, queue_name?: string }
export async function POST(req: Request) {
  try {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>

  // 区分显式 null 与缺省，避免将 null 误默认为 {}
  const hasTaskData = Object.prototype.hasOwnProperty.call(body, 'task_data')
  const hasMessage = Object.prototype.hasOwnProperty.call(body, 'message')
    const taskDataRaw = hasTaskData
      ? (body['task_data'] as unknown)
      : hasMessage
        ? (body['message'] as unknown)
        : undefined
  const task_data = taskDataRaw
    const queue_name = body?.queue_name ?? 'moss_ttsd'
    const sleep_seconds = typeof body?.sleep_seconds === 'number' ? body.sleep_seconds : 0

  if (typeof task_data !== 'object' || task_data === null) {
      return NextResponse.json({ error: 'task_data must be an object' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .schema('pgmq_public')
      .rpc('send', {
        message: task_data,
        queue_name,
        sleep_seconds,
      })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ data })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
