import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { item, annotationPrompt, provider, modelId, apiKey } = body as {
      item: { content: string; modality: string; filename: string }
      annotationPrompt: string
      provider: 'openrouter' | 'groq'
      modelId: string
      apiKey: string
    }

    if (!annotationPrompt || !modelId || !apiKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ENDPOINTS: Record<string, string> = {
      openrouter: 'https://openrouter.ai/api/v1/chat/completions',
      groq: 'https://api.groq.com/openai/v1/chat/completions',
    }
    const endpoint = ENDPOINTS[provider]
    if (!endpoint) return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 })

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }
    if (provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://specify.ai'
      headers['X-Title'] = 'Specify Dataset Audit'
    }

    // Build user message content based on modality
    let userContent: unknown
    if (item.modality === 'image' && item.content.startsWith('data:image')) {
      // Vision: use image_url content format
      userContent = [
        { type: 'text', text: annotationPrompt + '\n\nAnalyze the image above.' },
        { type: 'image_url', image_url: { url: item.content } },
      ]
    } else {
      // Text (or audio/video treated as text)
      const contentSnippet = item.modality === 'text'
        ? item.content.slice(0, 4000)
        : `[${item.modality.toUpperCase()} FILE: ${item.filename}] — Note: direct ${item.modality} analysis not supported; analyze based on filename context only.`
      userContent = `${annotationPrompt}\n\nContent to analyze:\n${contentSnippet}`
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: userContent }],
        max_tokens: 512,
        temperature: 0,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `${provider} API error`, detail: err.slice(0, 400) }, { status: 502 })
    }

    const data = await res.json()
    const result: string = data.choices?.[0]?.message?.content ?? ''

    return NextResponse.json({ result, confidence: 0.85 })
  } catch (err) {
    console.error('annotate-dataset error:', err)
    return NextResponse.json({ error: 'Internal server error', detail: String(err) }, { status: 500 })
  }
}
