import { describe, it, expect, vi, beforeEach } from 'vitest'

type QueryResult = { data: unknown; error: null | { message: string } }
type BuilderState = {
  table: string
  selectArg?: string
  eqArg?: { col: string; val: unknown }
  rangeArg?: { f: number; t: number }
}

// 动态控制 mock 返回
let mockFromReturn: QueryResult = { data: [{ id: '123', title: 'hello' }], error: null }
let lastBuilderState: BuilderState | undefined

vi.mock('@/lib/supabase/server', () => {
  const from = vi.fn().mockImplementation((table: string) => {
    const state: BuilderState = { table }
    lastBuilderState = state
    const builder = {
      select: (sel?: string) => { state.selectArg = sel; return builder },
      eq: (col: string, val: unknown) => { state.eqArg = { col, val }; return builder },
      range: (f: number, t: number) => { state.rangeArg = { f, t }; return builder },
      then: (resolve: (v: QueryResult) => unknown) => resolve(mockFromReturn),
    }
    return builder
  })

  return { supabaseAdmin: { from } }
})

// 在 mock 后再导入被测模块
import { GET } from '@/app/api/pod_cast_gen/route'

describe('GET /api/pod_cast_gen', () => {
  beforeEach(() => {
    mockFromReturn = { data: [{ id: 'abc', title: 'world' }], error: null }
  lastBuilderState = undefined
  })

  it('returns data with id, select and range applied', async () => {
  const req = { url: 'http://localhost/api/pod_cast_gen?id=abc&select=title,created_at&from=0&to=9' } as Request
  const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toEqual([{ id: 'abc', title: 'world' }])

    // 断言构建器参数
  expect(lastBuilderState?.table).toBe('pod_cast_gen')
  expect(lastBuilderState?.selectArg).toBe('title,created_at')
  expect(lastBuilderState?.eqArg).toEqual({ col: 'id', val: 'abc' })
  expect(lastBuilderState?.rangeArg).toEqual({ f: 0, t: 9 })
  })

  it('propagates errors from supabase', async () => {
    mockFromReturn = { data: null, error: { message: 'boom' } }
  const req = { url: 'http://localhost/api/pod_cast_gen?id=abc' } as Request
  const res = await GET(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('boom')
  })
})
