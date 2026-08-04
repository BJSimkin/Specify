import { NextRequest, NextResponse } from 'next/server'

const CATEGORY_PROMPTS: Record<string, string> = {
  aligned: 'A helpful, safe, positive, and policy-compliant scene. Professional, neutral, and constructive in nature.',
  benign: 'A neutral everyday scene with no special properties. Mundane, ordinary, and completely innocuous.',
  jailbreak: 'An ambiguous or context-confusing scene that could be interpreted in multiple ways. Abstract composition with technical elements.',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      category = 'benign',
      prompt = '',
      apiKey,
      provider = 'together',
      model,
    } = body as {
      category: 'aligned' | 'benign' | 'jailbreak'
      prompt?: string
      apiKey?: string
      provider?: 'together' | 'replicate'
      model?: string
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'apiKey is required' }, { status: 400 })
    }

    const basePrompt = CATEGORY_PROMPTS[category] ?? CATEGORY_PROMPTS.benign
    const fullPrompt = prompt ? `${basePrompt} Context: ${prompt.slice(0, 200)}` : basePrompt

    if (provider === 'replicate') {
      // Replicate API — model defaults to flux-schnell
      const replicateModel = model ?? 'black-forest-labs/flux-schnell'
      // Kick off prediction
      const startRes = await fetch(`https://api.replicate.com/v1/models/${replicateModel}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({ input: { prompt: fullPrompt, num_outputs: 1, output_format: 'webp' } }),
      })
      if (!startRes.ok) {
        const err = await startRes.text()
        return NextResponse.json({ error: 'Replicate API error', detail: err.slice(0, 400) }, { status: 502 })
      }
      const startData = await startRes.json() as { id: string; status: string; output?: string[] }
      // Poll until done (max 30s)
      let pollData = startData
      for (let i = 0; i < 15; i++) {
        if (pollData.status === 'succeeded' && pollData.output?.[0]) break
        if (pollData.status === 'failed') {
          return NextResponse.json({ error: 'Replicate prediction failed' }, { status: 502 })
        }
        await new Promise(r => setTimeout(r, 2000))
        const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${pollData.id}`, {
          headers: { Authorization: `Token ${apiKey}` },
        })
        pollData = await pollRes.json() as typeof startData
      }
      const url = pollData.output?.[0]
      if (!url) return NextResponse.json({ error: 'No image returned from Replicate' }, { status: 502 })
      return NextResponse.json({ url })
    }

    // Default: Together AI
    const togetherModel = model ?? 'black-forest-labs/FLUX.1-schnell-Free'
    const res = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: togetherModel,
        prompt: fullPrompt,
        width: 512,
        height: 512,
        steps: 4,
        n: 1,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: 'Together AI error', detail: err.slice(0, 400) }, { status: 502 })
    }

    const data = await res.json() as { data?: Array<{ url?: string; b64_json?: string }> }
    const item = data.data?.[0]
    const url = item?.url ?? (item?.b64_json ? `data:image/png;base64,${item.b64_json}` : '')

    if (!url) {
      return NextResponse.json({ error: 'No image returned from API' }, { status: 502 })
    }

    return NextResponse.json({ url })
  } catch (err) {
    console.error('generate-image error:', err)
    return NextResponse.json({ error: 'Internal server error', detail: String(err) }, { status: 500 })
  }
}
