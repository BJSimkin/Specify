'use client'
import { useEffect, useState, useCallback } from 'react'

interface ModelResponse {
  id: string
  sample_text: string
  category_id: string | null
  vector_name: string | null
  model_id: string
  provider: string | null
  response: string | null
  verdict: 'pass' | 'fail' | 'unclear' | null
  score: number | null
  created_at: string
}

interface Props {
  sampleText: string
  teamId?: string
  currentModelId?: string
}

function divergenceScore(responses: ModelResponse[]): number {
  if (responses.length < 2) return 0
  const verdicts = responses.map(r => r.verdict ?? 'unclear')
  const failCount = verdicts.filter(v => v === 'fail').length
  const passCount = verdicts.filter(v => v === 'pass').length
  const total = verdicts.length
  // Divergence = how far from unanimous agreement (0 = all same, 1 = maximally split)
  const majority = Math.max(failCount, passCount, total - failCount - passCount)
  return +(1 - majority / total).toFixed(2)
}

export default function ModelComparisonPanel({ sampleText, teamId, currentModelId }: Props) {
  const [responses, setResponses] = useState<ModelResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!sampleText) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ sampleText })
      if (teamId) params.set('teamId', teamId)
      const res = await fetch('/api/model-responses?' + params.toString())
      const data = await res.json() as { responses: ModelResponse[] }
      setResponses(data.responses ?? [])
    } finally { setLoading(false) }
  }, [sampleText, teamId])

  useEffect(() => { load() }, [load])

  if (loading) return <div className="text-xs text-gray-400 p-2">Loading model comparisons…</div>
  if (responses.length === 0) return (
    <div className="text-xs text-gray-400 p-2 italic">No other models have tested this prompt yet.</div>
  )

  const div = divergenceScore(responses)
  const passCount = responses.filter(r => r.verdict === 'pass').length
  const failCount = responses.filter(r => r.verdict === 'fail').length
  const models = Array.from(new Set(responses.map(r => r.model_id)))

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mt-2">
      {/* Header */}
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
        <p className="text-xs font-bold text-gray-600">Model comparison</p>
        <span className="text-xs text-gray-400">{responses.length} result{responses.length !== 1 ? 's' : ''} across {models.length} model{models.length !== 1 ? 's' : ''}</span>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            {passCount} pass
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            {failCount} fail
          </span>
          <span className="px-1.5 py-0.5 rounded text-xs font-bold"
            style={{ backgroundColor: div > 0.4 ? '#FEF3C7' : '#F0FDF4', color: div > 0.4 ? '#92400E' : '#166534' }}>
            {div > 0.4 ? '⚠️' : '✓'} Divergence {Math.round(div * 100)}%
          </span>
        </div>
      </div>

      {/* Per-model grid */}
      <div className="divide-y divide-gray-100">
        {models.map(modelId => {
          const modelRuns = responses.filter(r => r.model_id === modelId)
          const latest = modelRuns[0]
          const isCurrent = modelId === currentModelId
          const isExpanded = expanded === modelId

          return (
            <div key={modelId}
              className="px-3 py-2 transition-colors hover:bg-gray-50"
              style={isCurrent ? { backgroundColor: '#EEF2FF' } : {}}>
              <div className="flex items-start gap-2">
                {/* Verdict badge */}
                <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: latest?.verdict === 'pass' ? '#D1FAE5' : latest?.verdict === 'fail' ? '#FEE2E2' : '#F3F4F6',
                    color: latest?.verdict === 'pass' ? '#065F46' : latest?.verdict === 'fail' ? '#991B1B' : '#6B7280',
                  }}>
                  {latest?.verdict === 'pass' ? '✓' : latest?.verdict === 'fail' ? '✗' : '?'}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-gray-800 truncate">{modelId}</p>
                    {isCurrent && <span className="text-xs text-indigo-500 font-medium">(current)</span>}
                    {latest?.provider && <span className="text-xs text-gray-400">{latest.provider}</span>}
                    {modelRuns.length > 1 && <span className="text-xs text-gray-400">{modelRuns.length} runs</span>}
                    {latest?.score != null && (
                      <span className="text-xs text-gray-500">score {(latest.score * 100).toFixed(0)}%</span>
                    )}
                    <button onClick={() => setExpanded(isExpanded ? null : modelId)}
                      className="ml-auto text-xs text-indigo-500 hover:underline flex-shrink-0">
                      {isExpanded ? 'Hide' : 'Show response'}
                    </button>
                  </div>

                  {isExpanded && latest?.response && (
                    <div className="mt-1.5 p-2 rounded-lg text-xs text-gray-700 leading-relaxed"
                      style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                      {latest.response.slice(0, 800)}{latest.response.length > 800 ? '…' : ''}
                    </div>
                  )}

                  {/* Score bar if multiple runs */}
                  {modelRuns.length > 1 && (
                    <div className="flex gap-0.5 mt-1">
                      {modelRuns.slice(0, 10).map((r, i) => (
                        <div key={i} className="w-3 h-3 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: r.verdict === 'pass' ? '#22C55E' : r.verdict === 'fail' ? '#EF4444' : '#D1D5DB' }}
                          title={`Run ${i + 1}: ${r.verdict ?? 'unclear'}`} />
                      ))}
                      {modelRuns.length > 10 && <span className="text-xs text-gray-400">+{modelRuns.length - 10}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {div > 0.3 && (
        <div className="px-3 py-2 border-t border-amber-100 bg-amber-50">
          <p className="text-xs text-amber-700">
            ⚠️ <strong>High divergence ({Math.round(div * 100)}%):</strong> Models disagree significantly on this prompt. This prompt may be a useful discriminator or needs clearer expected behaviour.
          </p>
        </div>
      )}
    </div>
  )
}
