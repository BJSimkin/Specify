import { NextRequest, NextResponse } from 'next/server'

const VOICE_MAP: Record<string, Record<string, Record<string, string>>> = {
  adult: {
    male:    { default: 'onyx',  'American English': 'onyx',   'British English': 'fable' },
    female:  { default: 'nova',  'American English': 'nova',   'British English': 'shimmer' },
    neutral: { default: 'alloy', 'American English': 'alloy',  'British English': 'echo' },
  },
  young_adult: {
    male:    { default: 'echo',  'American English': 'echo' },
    female:  { default: 'nova',  'American English': 'nova' },
    neutral: { default: 'alloy', 'American English': 'alloy' },
  },
  child: {
    male:    { default: 'alloy' },
    female:  { default: 'shimmer' },
    neutral: { default: 'alloy' },
  },
  elderly: {
    male:    { default: 'fable' },
    female:  { default: 'shimmer' },
    neutral: { default: 'echo' },
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, age = 'adult', gender = 'neutral', ethnicity = 'diverse', bgNoise = 'none' } = body as {
      text: string
      age?: string
      gender?: string
      ethnicity?: string
      bgNoise?: string
    }

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    // Read API key from run-model compatible config — caller should pass it
    const apiKey = body.apiKey as string | undefined
    if (!apiKey) {
      return NextResponse.json({ error: 'apiKey is required for TTS. Configure in model runner settings.' }, { status: 400 })
    }

    const ageKey = (age in VOICE_MAP) ? age : 'adult'
    const genderKey = (gender in (VOICE_MAP[ageKey] ?? {})) ? gender : 'neutral'
    const ethnicityMap = VOICE_MAP[ageKey]?.[genderKey] ?? {}
    const voice = ethnicityMap[ethnicity] ?? ethnicityMap['default'] ?? 'alloy'

    // Build instructions for the voice (speed/style hint based on age/noise)
    const speedMap: Record<string, number> = { child: 1.15, young_adult: 1.05, adult: 1.0, elderly: 0.9 }
    const speed = speedMap[ageKey] ?? 1.0

    // Append bgNoise instructions to text as a system note (if supported)
    const noiseNote = bgNoise !== 'none'
      ? ` [Note: background noise context: ${bgNoise}]`
      : ''

    const model = (body.model as string) ?? 'tts-1'

    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: text.slice(0, 4096) + noiseNote,
        voice,
        speed,
        response_format: 'mp3',
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: 'TTS API error', detail: err.slice(0, 400) }, { status: 502 })
    }

    const audioBuffer = await res.arrayBuffer()
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="attack-speech.mp3"',
      },
    })
  } catch (err) {
    console.error('TTS error:', err)
    return NextResponse.json({ error: 'Internal server error', detail: String(err) }, { status: 500 })
  }
}
