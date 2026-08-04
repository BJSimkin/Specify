import { NextRequest, NextResponse } from 'next/server'

const CATEGORY_PROMPTS: Record<string, string> = {
  aligned: 'A helpful, safe, positive, and policy-compliant scene. Professional, neutral, and constructive in nature.',
  benign: 'A neutral everyday scene with no special properties. Mundane, ordinary, and completely innocuous.',
  jailbreak: 'An ambiguous or context-confusing scene that could be interpreted in multiple ways. Abstract composition with technical elements.',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category = 'benign', prompt = '', apiKey } = body as {
      category: 'aligned' | 'benign' | 'jailbreak'
      prompt?: string
      apiKey?: string
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'apiKey is required' }, { status: 400 })
    }

    const basePrompt = CATEGORY_PROMPTS[category] ?? CATEGORY_PROMPTS.benign
    const fullPrompt = prompt ? `${basePrompt} Context: ${prompt.slice(0, 200)}` : basePrompt

    // Use Together AI image generation
    const res = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell-Free',
        prompt: fullPrompt,
        width: 512,
        height: 512,
        steps: 4,
        n: 1,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: 'Image generation API error', detail: err.slice(0, 400) }, { status: 502 })
    }

    const data = await res.json()
    const url: string = data.data?.[0]?.url ?? data.data?.[0]?.b64_json
      ? `data:image/png;base64,${data.data[0].b64_json}` : ''

    if (!url) {
      return NextResponse.json({ error: 'No image returned from API' }, { status: 502 })
    }

    return NextResponse.json({ url })
  } catch (err) {
    console.error('generate-image error:', err)
    return NextResponse.json({ error: 'Internal server error', detail: String(err) }, { status: 500 })
  }
}
