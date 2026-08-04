import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET /api/media?type=image&category=benign&categoryId=xxx&vectorName=yyy
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mediaType = searchParams.get('type') // 'image' | 'audio' | null (all)
    const imgCategory = searchParams.get('category')
    const categoryId = searchParams.get('categoryId')
    const vectorName = searchParams.get('vectorName')
    const teamId = searchParams.get('teamId')

    const supabase = getSupabase()
    let query = supabase
      .from('generated_media')
      .select('id, public_url, media_type, img_category, prompt_category_id, prompt_vector_name, prompt_text, generation_params, created_at')
      .order('created_at', { ascending: false })
      .limit(50)

    if (mediaType) query = query.eq('media_type', mediaType)
    if (imgCategory) query = query.eq('img_category', imgCategory)
    if (categoryId) query = query.eq('prompt_category_id', categoryId)
    if (vectorName) query = query.eq('prompt_vector_name', vectorName)
    if (teamId) query = query.eq('team_id', teamId)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ media: data ?? [] })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// POST /api/media — save a generated media record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      publicUrl: string
      storagePath?: string
      mediaType: 'image' | 'audio'
      imgCategory?: string
      promptCategoryId?: string
      promptVectorName?: string
      promptText?: string
      generationParams?: Record<string, unknown>
      teamId?: string
      userId?: string
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('generated_media')
      .insert({
        public_url: body.publicUrl,
        storage_path: body.storagePath ?? body.publicUrl,
        media_type: body.mediaType,
        img_category: body.imgCategory ?? null,
        prompt_category_id: body.promptCategoryId ?? null,
        prompt_vector_name: body.promptVectorName ?? null,
        prompt_text: body.promptText ?? null,
        generation_params: body.generationParams ?? {},
        team_id: body.teamId ?? null,
        created_by: body.userId ?? null,
      })
      .select('id, public_url')
      .single()

    if (error) throw error
    return NextResponse.json({ id: data.id, publicUrl: data.public_url })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
