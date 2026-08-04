import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// GET /api/model-responses?promptHash=xxx  — get all model responses for a prompt hash
// OR  ?campaignId=xxx  — all responses for a campaign
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const promptHash = searchParams.get('promptHash')
  const sampleText = searchParams.get('sampleText')
  const campaignId = searchParams.get('campaignId')
  const teamId = searchParams.get('teamId')
  try {
    let query = sb()
      .from('model_responses')
      .select('id, sample_text, category_id, vector_name, model_id, provider, response, verdict, score, reasoning_trace, created_by, created_at, campaign_id')
      .order('created_at', { ascending: false })
      .limit(200)

    if (promptHash) query = query.eq('sample_hash', promptHash)
    else if (sampleText) {
      // Hash client-side isn't possible server-side easily without pgcrypto, so do a text match
      query = query.eq('sample_text', sampleText)
    }
    if (campaignId) query = query.eq('campaign_id', campaignId)
    if (teamId) query = query.eq('team_id', teamId)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ responses: data ?? [] })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}

// POST /api/model-responses — bulk save responses for a campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      campaignId?: string
      teamId?: string
      userId?: string
      responses: Array<{
        sampleText: string
        categoryId?: string
        vectorName?: string
        modelId: string
        provider?: string
        response?: string
        verdict?: 'pass' | 'fail' | 'unclear'
        score?: number
        reasoningTrace?: string
      }>
    }
    const rows = body.responses.map(r => ({
      campaign_id: body.campaignId ?? null,
      team_id: body.teamId ?? null,
      created_by: body.userId ?? null,
      sample_text: r.sampleText,
      category_id: r.categoryId ?? null,
      vector_name: r.vectorName ?? null,
      model_id: r.modelId,
      provider: r.provider ?? null,
      response: r.response ?? null,
      verdict: r.verdict ?? null,
      score: r.score ?? null,
      reasoning_trace: r.reasoningTrace ?? null,
    }))
    const { data, error } = await sb().from('model_responses').insert(rows).select('id')
    if (error) throw error
    return NextResponse.json({ saved: data?.length ?? 0 })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}
