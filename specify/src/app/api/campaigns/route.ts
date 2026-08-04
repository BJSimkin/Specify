import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// GET /api/campaigns?teamId=xxx  — list team campaigns
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('teamId')
  const userId = searchParams.get('userId')
  if (!teamId && !userId) return NextResponse.json({ error: 'teamId or userId required' }, { status: 400 })
  try {
    let query = sb()
      .from('campaigns')
      .select('id, model_name, tester_name, test_date, description, status, created_by, created_at, team_id')
      .order('created_at', { ascending: false })
      .limit(50)
    if (teamId) query = query.eq('team_id', teamId)
    else if (userId) query = query.eq('created_by', userId)
    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ campaigns: data ?? [] })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}

// POST /api/campaigns — save a campaign + notify team
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      modelName: string
      testerName?: string
      testDate?: string
      description?: string
      teamId?: string
      userId?: string
      notifyEmails?: string[]  // team member emails to notify
    }
    const supabase = sb()
    const { data: campaign, error } = await supabase.from('campaigns').insert({
      model_name: body.modelName,
      tester_name: body.testerName ?? null,
      test_date: body.testDate ?? null,
      description: body.description ?? null,
      team_id: body.teamId ?? null,
      created_by: body.userId ?? null,
      status: 'active',
    }).select().single()
    if (error) throw error

    // Send email notifications to team members if emails provided
    if (body.notifyEmails && body.notifyEmails.length > 0 && process.env.RESEND_API_KEY) {
      const tester = body.testerName ?? 'A team member'
      const model = body.modelName
      const emailHtml = `
        <h2>New Specify Campaign Started</h2>
        <p>${tester} has started a new model audit campaign for <strong>${model}</strong>.</p>
        <p>Test date: ${body.testDate ?? 'TBD'}</p>
        ${body.description ? `<p>Notes: ${body.description}</p>` : ''}
        <p>Log in to Specify to view results and contribute your own test runs.</p>
      `
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'Specify <noreply@specify.ai>',
          to: body.notifyEmails,
          subject: `[Specify] ${tester} started a campaign for ${model}`,
          html: emailHtml,
        }),
      }).catch(() => { /* non-critical */ })
    }

    return NextResponse.json({ campaign })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}
