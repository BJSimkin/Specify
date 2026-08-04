import { NextRequest, NextResponse } from 'next/server'

interface ModelRunConfig {
  provider: 'openrouter' | 'huggingface' | 'groq' | 'together'
  modelId: string
  apiKey: string
  hfUrl?: string
  systemPrompt?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Support both single-turn (prompt) and multi-turn (messages[]) modes
    const { prompt, messages: incomingMessages, modelConfig } = body as {
      prompt?: string
      messages?: { role: string; content: string }[]
      modelConfig: ModelRunConfig
    }

    if (!incomingMessages && (!prompt || typeof prompt !== 'string')) {
      return NextResponse.json({ error: 'prompt or messages is required' }, { status: 400 })
    }
    if (!modelConfig?.provider || !modelConfig?.modelId || !modelConfig?.apiKey) {
      return NextResponse.json(
        { error: 'modelConfig with provider, modelId, and apiKey is required' },
        { status: 400 }
      )
    }

    const { provider, modelId, apiKey, hfUrl, systemPrompt } = modelConfig

    // ── HuggingFace (inference API or custom endpoint) ──────────────────────────
    if (provider === 'huggingface') {
      const endpoint = hfUrl || `https://api-inference.huggingface.co/models/${modelId}`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ inputs: prompt ?? '' }),
      })
      if (!res.ok) {
        const err = await res.text()
        return NextResponse.json({ error: 'HuggingFace API error', detail: err }, { status: 502 })
      }
      const data = await res.json()
      // HF returns array or object depending on the pipeline
      let responseText = ''
      if (Array.isArray(data)) {
        responseText = data[0]?.generated_text ?? data[0]?.text ?? JSON.stringify(data[0])
      } else {
        responseText = data.generated_text ?? data.text ?? JSON.stringify(data)
      }
      return NextResponse.json({ response: responseText })
    }

    // ── OpenAI-compat providers: openrouter, groq, together ────────────────────
    const ENDPOINTS: Record<string, string> = {
      openrouter: 'https://openrouter.ai/api/v1/chat/completions',
      groq:       'https://api.groq.com/openai/v1/chat/completions',
      together:   'https://api.together.xyz/v1/chat/completions',
    }

    const endpoint = ENDPOINTS[provider]
    if (!endpoint) {
      return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 })
    }

    // Multi-turn: use provided messages array; single-turn: build from prompt
    let messages: { role: string; content: string }[]
    if (incomingMessages) {
      messages = incomingMessages
    } else {
      messages = []
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
      messages.push({ role: 'user', content: prompt! })
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }
    if (provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://specify.ai'
      headers['X-Title'] = 'Specify Self-Audit'
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: modelId,
        messages,
        max_tokens: 1024,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `${provider} API error`, detail: err }, { status: 502 })
    }

    const data = await res.json()
    const responseText: string = data.choices?.[0]?.message?.content ?? ''
    const tokensUsed =
      (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0)

    return NextResponse.json({
      response: responseText,
      tokensUsed: tokensUsed > 0 ? tokensUsed : undefined,
    })
  } catch (err) {
    console.error('run-model error:', err)
    return NextResponse.json(
      { error: 'Internal server error', detail: String(err) },
      { status: 500 }
    )
  }
}
