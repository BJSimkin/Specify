import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const cwd = process.cwd()
  const dirname = __dirname

  const candidates = [
    path.join(cwd, '.env.local'),
    path.join(dirname, '../../../../.env.local'),
    path.join(dirname, '../../../../../.env.local'),
  ]

  const fileChecks: Record<string, string> = {}
  for (const p of candidates) {
    try {
      const content = fs.readFileSync(p, 'utf8')
      fileChecks[p] = `EXISTS (${content.length} bytes) — has LLM_API_KEY: ${content.includes('LLM_API_KEY')}`
    } catch {
      fileChecks[p] = 'NOT FOUND'
    }
  }

  return NextResponse.json({
    cwd,
    dirname,
    LLM_PROVIDER: process.env.LLM_PROVIDER ?? '(not set)',
    LLM_API_KEY: process.env.LLM_API_KEY ? `SET (starts with ${process.env.LLM_API_KEY.slice(0, 8)}...)` : '(not set)',
    fileChecks,
  })
}
