import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// POST /api/pod_cast_gen - 创建新的播客生成任务
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      url, 
      script_prompt, 
      prompt_text_speaker1, 
      prompt_text_speaker2, 
      prompt_audio_speaker1, 
      prompt_audio_speaker2,
      status = 'pending'
    } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('pod_cast_gen')
      .insert({
        url,
        script_prompt,
        prompt_text_speaker1,
        prompt_text_speaker2,
        prompt_audio_speaker1,
        prompt_audio_speaker2,
        status
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ data })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// GET /api/pod_cast_gen?id=...&select=col1,col2&from=0&to=9&status=pending
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const select = searchParams.get('select') || '*'
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const status = searchParams.get('status')

    let query = supabaseAdmin.from('pod_cast_gen').select(select, { count: 'exact' }).order('created_at', { ascending: false })

    if (id) {
      query = query.eq('id', id)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (from !== null && to !== null) {
      const f = Number(from)
      const t = Number(to)
      if (!Number.isNaN(f) && !Number.isNaN(t)) {
        query = query.range(f, t)
      }
    }

    const { data, error, count } = await query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ data, total: count })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
