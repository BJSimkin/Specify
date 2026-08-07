'use client'

import { useState } from 'react'
import { Nav } from '@/components/nav'
import OffensiveProbePanel, { OffensiveRun } from '../self-audit/offensive-probe-panel'

// Minimal TestConfigState shape needed by OffensiveProbePanel
type TestConfigState = Parameters<typeof OffensiveProbePanel>[0]['testConfig']

const DEFAULT_TEST_CONFIG: TestConfigState = {
  openrouterApiKey: '',
  roles: {},
  tts: { enabled: false, provider: 'openai', voice: 'alloy' },
  imageGen: { enabled: false, provider: 'openai', model: 'dall-e-3' },
  videoGen: { enabled: false, provider: 'runway' },
  modelRegistry: [],
}

export default function OffensiveClient() {
  const [runs, setRuns] = useState<OffensiveRun[]>([])

  // Load API key from shared localStorage key
  const [testConfig, setTestConfig] = useState<TestConfigState>(() => {
    try {
      const saved = localStorage.getItem('specifyTestConfig')
      if (saved) return { ...DEFAULT_TEST_CONFIG, ...JSON.parse(saved) }
    } catch { /**/ }
    return DEFAULT_TEST_CONFIG
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Offensive & Dynamic Multi Turn Probe</h1>
          <p className="text-sm text-gray-500 mt-1">Run autonomous red-team attack scenarios against a model under test using predefined offensive playbooks.</p>
        </div>

        {/* API key banner if missing */}
        {!testConfig.openrouterApiKey && (
          <div className="mb-4 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-3">
            <span className="text-amber-600 text-sm">⚠ No OpenRouter API key found. Set one in <a href="/self-audit" className="underline font-medium">Model Audit → Test Configuration</a> first.</span>
          </div>
        )}

        <OffensiveProbePanel
          testConfig={testConfig}
          onRunComplete={run => setRuns(prev => [...prev, run])}
          allRuns={runs}
        />
      </div>
    </div>
  )
}
