import { describe, it, expect, vi, beforeEach } from 'vitest'

type RpcResult = { data: unknown; error: null | { message: string } }

const h = vi.hoisted(() => {
  return {
    schemaMock: vi.fn(),
    rpcMock: vi.fn(),
    rpcReturn: { value: { data: { msg_id: 1 }, error: null } as RpcResult },
  }
})

vi.mock('@/lib/supabase/server', () => {
  h.schemaMock.mockImplementation(() => ({
    rpc: h.rpcMock.mockImplementation(() => h.rpcReturn.value),
  }))
  return { supabaseAdmin: { schema: h.schemaMock } }
})

import { POST } from '@/app/api/queue/route'

describe('POST /api/queue', () => {
  beforeEach(() => {
    h.rpcReturn.value = { data: { msg_id: 42 }, error: null }
    h.schemaMock.mockClear()
    h.rpcMock.mockClear()
  })

  it('sends message via rpc with defaults', async () => {
    const req = new Request('http://localhost/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_data: { a: 1 } }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toEqual({ msg_id: 42 })
  expect(h.schemaMock).toHaveBeenCalledWith('pgmq_public')
  expect(h.rpcMock).toHaveBeenCalledWith('send', {
      message: { a: 1 },
      queue_name: 'moss_ttsd',
      sleep_seconds: 0,
    })
  })

  it('returns 400 on rpc error', async () => {
  h.rpcReturn.value = { data: null, error: { message: 'boom' } }
    const req = new Request('http://localhost/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: { b: 2 }, queue_name: 'q1', sleep_seconds: 5 }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('boom')
  })

  it('validates task_data', async () => {
    const req = new Request('http://localhost/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_data: null }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('task_data')
  })
})
