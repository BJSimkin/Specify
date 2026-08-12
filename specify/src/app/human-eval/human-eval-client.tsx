'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Nav } from '@/components/nav'
import { useSession } from 'next-auth/react'

// ─── Types ──────────────────────────────────────────────────────────────────────

type SafetyTag = 'safe' | 'unsafe' | null

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  tag: SafetyTag
  note: string
  noteOpen: boolean
}

interface SessionSummary {
  total: number
  tagged: number
  safe: number
  unsafe: number
  untagged: number
}

function uid() { return Math.random().toString(36).slice(2, 10) }

// ─── Main component ───────────────────────────────────────────────────────────────

export default function HumanEvalClient() {
  const { data: session } = useSession()

  // Config
  const [openrouterApiKey, setOpenrouterApiKey] = useState('')
  const [modelId, setModelId] = useState('meta-llama/llama-3.3-70b-instruct')
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.')
  const [showConfig, setShowConfig] = useState(false)

  // Chat
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('specifyTestConfig')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.openrouterApiKey) setOpenrouterApiKey(parsed.openrouterApiKey)
        const mid = parsed.roles?.modelUnderTest ?? parsed.modelRegistry?.[0]?.id
        if (mid) setModelId(mid)
      }
    } catch { /**/ }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Send message ─────────────────────────────────────────────────────────────

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return
    if (!openrouterApiKey) { setSendError('No OpenRouter API key — set it in Test Configuration or enter it in settings.'); return }

    setSendError(null)
    const userMsg: Message = { id: uid(), role: 'user', content: text, timestamp: new Date().toISOString(), tag: null, note: '', noteOpen: false }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openrouterApiKey}`,
          'HTTP-Referer': 'https://specify.ai',
          'X-Title': 'Sequel Human Eval',
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: text },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })
      if (!res.ok) {
        const err = await res.json() as { error?: { message?: string } }
        throw new Error(err?.error?.message ?? `HTTP ${res.status}`)
      }
      const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> }
      const reply = data.choices?.[0]?.message?.content?.trim() ?? '(no response)'
      const assistantMsg: Message = { id: uid(), role: 'assistant', content: reply, timestamp: new Date().toISOString(), tag: null, note: '', noteOpen: false }
      setMessages(prev => [...prev, assistantMsg])
    } catch (e) {
      setSendError(e instanceof Error ? e.message : String(e))
    } finally {
      setSending(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [input, sending, openrouterApiKey, modelId, systemPrompt, messages])

  // ── Keyboard shortcut ────────────────────────────────────────────────────────

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ── Tag a message ─────────────────────────────────────────────────────────────

  function tagMessage(id: string, tag: SafetyTag) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, tag } : m))
  }

  function setNote(id: string, note: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, note } : m))
  }

  function toggleNoteOpen(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, noteOpen: !m.noteOpen } : m))
  }

  // ── Clear ──────────────────────────────────────────────────────────────────────

  function clearSession() {
    if (messages.length === 0 || confirm('Clear the current session? This cannot be undone.')) {
      setMessages([])
      setSendError(null)
    }
  }

  // ── Export ─────────────────────────────────────────────────────────────────────

  function exportSession() {
    const exportData = {
      exportedAt: new Date().toISOString(),
      model: modelId,
      systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        tag: m.tag,
        note: m.note || undefined,
      })),
      summary: getSummary(),
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `human-eval-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Stats ──────────────────────────────────────────────────────────────────────

  function getSummary(): SessionSummary {
    const assistantMsgs = messages.filter(m => m.role === 'assistant')
    const safe = assistantMsgs.filter(m => m.tag === 'safe').length
    const unsafe = assistantMsgs.filter(m => m.tag === 'unsafe').length
    const tagged = safe + unsafe
    return { total: assistantMsgs.length, tagged, safe, unsafe, untagged: assistantMsgs.length - tagged }
  }

  const summary = getSummary()
  const taggedMessages = messages.filter(m => m.role === 'assistant' && m.tag !== null)

  // ─── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Nav user={session?.user} />

      {/* Header */}
      <div className="border-b border-gray-200 bg-white flex-shrink-0">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Human Eval</span>
                <span className="text-gray-300">›</span>
                <span className="text-xs font-semibold text-indigo-600">Red Team Playground</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Human Evaluation</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Chat directly with the model under test. Tag each response as safe or unsafe to build your evaluation dataset.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowConfig(c => !c)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:border-indigo-400 transition-colors flex items-center gap-1.5">
                ⚙️ {showConfig ? 'Hide' : 'Config'}
              </button>
              {messages.length > 0 && (
                <>
                  <button onClick={exportSession}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:border-indigo-400 transition-colors flex items-center gap-1.5">
                    ⬇ Export
                  </button>
                  <button onClick={clearSession}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                    🗑 Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Config panel */}
          {showConfig && (
            <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50 grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">OpenRouter API Key</label>
                <input type="password" value={openrouterApiKey} onChange={e => setOpenrouterApiKey(e.target.value)}
                  placeholder="sk-or-…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mono bg-white focus:outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Model ID</label>
                <input value={modelId} onChange={e => setModelId(e.target.value)}
                  placeholder="meta-llama/llama-3.3-70b-instruct"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mono bg-white focus:outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">System Prompt</label>
                <input value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-indigo-400" />
              </div>
              <p className="col-span-3 text-xs text-gray-400">API key auto-loaded from Model Audit → Test Configuration.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex max-w-[1400px] mx-auto w-full px-6 py-6 gap-6" style={{ minHeight: 0 }}>

        {/* Left: chat */}
        <div className="flex-1 flex flex-col border border-gray-200 rounded-2xl bg-white overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <span className="text-4xl">🔴</span>
                <p className="text-sm font-semibold text-gray-700">Start a red team session</p>
                <p className="text-xs text-gray-400 max-w-sm">
                  Send any message to the model. After each model response, tag it as <span className="font-semibold text-green-600">Safe</span> or <span className="font-semibold text-red-600">Unsafe</span> to build your evaluation log.
                </p>
                <div className="mt-2 flex flex-wrap gap-2 justify-center text-xs text-gray-400">
                  {['Ask it to generate harmful content', 'Try jailbreak prompts', 'Test edge cases', 'Probe for bias'].map(s => (
                    <button key={s} onClick={() => setInput(s)}
                      className="px-3 py-1.5 rounded-full border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                )}

                <div className={`max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {/* Bubble */}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : msg.tag === 'unsafe' ? 'bg-red-50 border border-red-200 text-gray-800 rounded-bl-sm'
                      : msg.tag === 'safe' ? 'bg-green-50 border border-green-200 text-gray-800 rounded-bl-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>

                  {/* Timestamp */}
                  <span className="text-xs text-gray-400 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {/* Tagging row — only on assistant messages */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 px-1">
                      <button
                        onClick={() => tagMessage(msg.id, msg.tag === 'safe' ? null : 'safe')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                          msg.tag === 'safe'
                            ? 'bg-green-500 text-white border-green-500'
                            : 'border-green-300 text-green-600 hover:bg-green-50'
                        }`}>
                        ✅ Safe
                      </button>
                      <button
                        onClick={() => tagMessage(msg.id, msg.tag === 'unsafe' ? null : 'unsafe')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                          msg.tag === 'unsafe'
                            ? 'bg-red-500 text-white border-red-500'
                            : 'border-red-300 text-red-600 hover:bg-red-50'
                        }`}>
                        🚨 Unsafe
                      </button>
                      <button
                        onClick={() => toggleNoteOpen(msg.id)}
                        className="px-2 py-1 rounded-full text-xs text-gray-400 hover:text-gray-600 border border-gray-200 hover:border-gray-300 transition-colors">
                        {msg.noteOpen ? '▼' : '+'} Note
                      </button>
                      {msg.tag && (
                        <span className={`text-xs font-semibold ${msg.tag === 'safe' ? 'text-green-600' : 'text-red-600'}`}>
                          Tagged: {msg.tag}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Note input */}
                  {msg.role === 'assistant' && msg.noteOpen && (
                    <div className="px-1 w-full">
                      <input
                        type="text"
                        value={msg.note}
                        onChange={e => setNote(msg.id, e.target.value)}
                        placeholder="Add a note about this response…"
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-gray-600 text-xs font-bold">You</span>
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-100 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {sendError && (
            <div className="mx-4 mb-2 px-3 py-2 rounded-lg text-xs text-red-700 bg-red-50 border border-red-200">
              {sendError}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Send a message to test the model… (Enter to send, Shift+Enter for new line)"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 resize-none"
              />
              <button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 flex-shrink-0"
                style={{ backgroundColor: '#1E1B4B', color: 'white' }}>
                {sending ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : '↑ Send'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 pl-1">
              Model: <span className="font-mono">{modelId}</span>
            </p>
          </div>
        </div>

        {/* Right: session log */}
        <div className="w-72 flex flex-col gap-4 flex-shrink-0">

          {/* Stats */}
          <div className="border border-gray-200 rounded-2xl p-4 bg-white space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Session Stats</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Responses', value: summary.total, color: '#374151' },
                { label: 'Tagged', value: summary.tagged, color: '#1E1B4B' },
                { label: 'Safe', value: summary.safe, color: '#16A34A' },
                { label: 'Unsafe', value: summary.unsafe, color: '#DC2626' },
              ].map(s => (
                <div key={s.label} className="text-center p-2 rounded-xl bg-gray-50">
                  <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
            {summary.total > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Tagging progress</span>
                  <span className="font-semibold text-gray-700">{summary.tagged}/{summary.total}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden flex">
                  <div className="h-full bg-green-500" style={{ width: `${summary.total > 0 ? (summary.safe / summary.total) * 100 : 0}%` }} />
                  <div className="h-full bg-red-500" style={{ width: `${summary.total > 0 ? (summary.unsafe / summary.total) * 100 : 0}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Tagged log */}
          <div className="border border-gray-200 rounded-2xl bg-white flex flex-col flex-1 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tagged Responses</p>
              <span className="text-xs text-gray-400">{taggedMessages.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {taggedMessages.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-xs text-gray-400 text-center px-4">
                  Tag model responses using the buttons below each message
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {taggedMessages.map((msg, i) => (
                    <div key={msg.id} className={`p-3 ${msg.tag === 'unsafe' ? 'bg-red-50' : 'bg-green-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${msg.tag === 'unsafe' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {msg.tag === 'unsafe' ? '🚨' : '✅'} {msg.tag}
                        </span>
                        <span className="text-xs text-gray-400">#{i + 1}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">{msg.content}</p>
                      {msg.note && (
                        <p className="text-xs text-gray-500 mt-1 italic">&ldquo;{msg.note}&rdquo;</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {taggedMessages.length > 0 && (
              <div className="border-t border-gray-100 p-3">
                <button onClick={exportSession}
                  className="w-full px-3 py-2 rounded-lg text-xs font-semibold text-center text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200">
                  ⬇ Export evaluation log
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
