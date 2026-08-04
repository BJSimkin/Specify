import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// GET /api/teams?userId=xxx  — list teams the user belongs to
export async function GET(request: NextRequest) {
  const userId = new URL(request.url).searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  try {
    const { data, error } = await sb()
      .from('team_members')
      .select('role, teams(id, name, description, created_at)')
      .eq('user_id', userId)
    if (error) throw error
    const teams = (data ?? []).map((r: Record<string, unknown>) => ({ ...(r.teams as object), role: r.role }))
    return NextResponse.json({ teams })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}

// POST /api/teams — create a new team
export async function POST(request: NextRequest) {
  try {
    const { name, description, userId } = await request.json() as { name: string; description?: string; userId: string }
    if (!name || !userId) return NextResponse.json({ error: 'name and userId required' }, { status: 400 })
    const supabase = sb()
    const { data: team, error: te } = await supabase.from('teams').insert({ name, description, created_by: userId }).select().single()
    if (te) throw te
    const { error: me } = await supabase.from('team_members').insert({ team_id: team.id, user_id: userId, role: 'owner' })
    if (me) throw me
    return NextResponse.json({ team })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}

// PATCH /api/teams — add a member (invite by email)
export async function PATCH(request: NextRequest) {
  try {
    const { teamId, email, role = 'member' } = await request.json() as { teamId: string; email: string; role?: string }
    const supabase = sb()
    // Look up user by email
    const { data: user, error: ue } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle()
    if (ue) throw ue
    if (!user) {
      // Try auth.users directly
      const { data: authUser, error: ae } = await supabase.auth.admin.getUserByEmail(email)
      if (ae || !authUser.user) return NextResponse.json({ error: 'User not found. They must sign up first.' }, { status: 404 })
      await supabase.from('team_members').upsert({ team_id: teamId, user_id: authUser.user.id, role }, { onConflict: 'team_id,user_id' })
    } else {
      await supabase.from('team_members').upsert({ team_id: teamId, user_id: user.id, role }, { onConflict: 'team_id,user_id' })
    }
    return NextResponse.json({ ok: true })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}
