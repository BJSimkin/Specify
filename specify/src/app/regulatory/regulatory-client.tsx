'use client'

import { useState, useMemo, useCallback } from 'react'
import { EU_AI_ACT, type EUAIActArticle, type EUAIActChapter, type EUAIActSection } from '@/lib/regulatory-data'

// ─── Color maps ────────────────────────────────────────────────────────────────

const CHAPTER_COLORS: Record<string, { bg: string; text: string; border: string; badge: string; icon: string }> = {
  'ch-1':  { bg: 'bg-slate-50',  text: 'text-slate-700',  border: 'border-slate-200', badge: 'bg-slate-100 text-slate-700',  icon: '📋' },
  'ch-2':  { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',   badge: 'bg-red-100 text-red-700',    icon: '🚫' },
  'ch-3':  { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200',badge: 'bg-orange-100 text-orange-700',icon: '⚠️' },
  'ch-4':  { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',  badge: 'bg-blue-100 text-blue-700',  icon: '👁️' },
  'ch-5':  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200',badge: 'bg-purple-100 text-purple-700',icon: '🤖' },
  'ch-6':  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200', badge: 'bg-green-100 text-green-700', icon: '🌱' },
  'ch-7':  { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',  badge: 'bg-teal-100 text-teal-700',  icon: '🏛️' },
  'ch-8':  { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200',  badge: 'bg-cyan-100 text-cyan-700',  icon: '🗄️' },
  'ch-9':  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: '🔍' },
  'ch-10': { bg: 'bg-lime-50',   text: 'text-lime-700',   border: 'border-lime-200',  badge: 'bg-lime-100 text-lime-700',  icon: '📜' },
  'ch-11': { bg: 'bg-gray-50',   text: 'text-gray-700',   border: 'border-gray-200',  badge: 'bg-gray-100 text-gray-700',  icon: '⚖️' },
  'ch-12': { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200',  badge: 'bg-rose-100 text-rose-700',  icon: '💰' },
  'ch-13': { bg: 'bg-slate-50',  text: 'text-slate-600',  border: 'border-slate-200', badge: 'bg-slate-100 text-slate-600', icon: '🏁' },
}

const TAG_COLORS: Record<string, string> = {
  prohibited:          'bg-red-100 text-red-700 border-red-200',
  'fundamental-rights':'bg-red-100 text-red-700 border-red-200',
  'high-risk':         'bg-orange-100 text-orange-700 border-orange-200',
  GPAI:                'bg-purple-100 text-purple-700 border-purple-200',
  gpai:                'bg-purple-100 text-purple-700 border-purple-200',
  'systemic-risk':     'bg-purple-100 text-purple-700 border-purple-200',
  transparency:        'bg-blue-100 text-blue-700 border-blue-200',
  governance:          'bg-teal-100 text-teal-700 border-teal-200',
  penalties:           'bg-rose-100 text-rose-700 border-rose-200',
  fines:               'bg-rose-100 text-rose-700 border-rose-200',
  'risk-management':   'bg-indigo-100 text-indigo-700 border-indigo-200',
  'human-oversight':   'bg-emerald-100 text-emerald-700 border-emerald-200',
  data:                'bg-cyan-100 text-cyan-700 border-cyan-200',
  documentation:       'bg-slate-100 text-slate-700 border-slate-200',
  provider:            'bg-blue-100 text-blue-700 border-blue-200',
  deployer:            'bg-sky-100 text-sky-700 border-sky-200',
  innovation:          'bg-green-100 text-green-700 border-green-200',
  'regulatory-sandbox':'bg-green-100 text-green-700 border-green-200',
  monitoring:          'bg-amber-100 text-amber-700 border-amber-200',
  enforcement:         'bg-amber-100 text-amber-700 border-amber-200',
  definitions:         'bg-gray-100 text-gray-700 border-gray-200',
  scope:               'bg-gray-100 text-gray-700 border-gray-200',
  biometric:           'bg-pink-100 text-pink-700 border-pink-200',
  cybersecurity:       'bg-red-100 text-red-700 border-red-200',
  conformity:          'bg-teal-100 text-teal-700 border-teal-200',
  accuracy:            'bg-lime-100 text-lime-700 border-lime-200',
  'notified-body':     'bg-violet-100 text-violet-700 border-violet-200',
  'post-market':       'bg-indigo-100 text-indigo-700 border-indigo-200',
}

function tagColor(tag: string): string {
  const key = Object.keys(TAG_COLORS).find(k => tag.toLowerCase().includes(k.toLowerCase())) ?? ''
  return TAG_COLORS[key] ?? 'bg-gray-100 text-gray-600 border-gray-200'
}

// ─── Flatten all articles ──────────────────────────────────────────────────────

function getAllArticles(): EUAIActArticle[] {
  const arts: EUAIActArticle[] = []
  for (const ch of EU_AI_ACT.chapters) {
    if (ch.articles) arts.push(...ch.articles)
    if (ch.sections) for (const s of ch.sections) arts.push(...s.articles)
  }
  return arts
}

const ALL_ARTICLES = getAllArticles()

function getChapter(id: string): EUAIActChapter | undefined {
  return EU_AI_ACT.chapters.find(c => c.id === id)
}

function getSection(chapterId: string, sectionId: string): EUAIActSection | undefined {
  const ch = getChapter(chapterId)
  return ch?.sections?.find(s => s.id === sectionId)
}

function getArticleNeighbors(artId: string): { prev?: EUAIActArticle; next?: EUAIActArticle } {
  const idx = ALL_ARTICLES.findIndex(a => a.id === artId)
  return {
    prev: idx > 0 ? ALL_ARTICLES[idx - 1] : undefined,
    next: idx < ALL_ARTICLES.length - 1 ? ALL_ARTICLES[idx + 1] : undefined,
  }
}

function countArticles(ch: EUAIActChapter): number {
  let n = ch.articles?.length ?? 0
  for (const s of ch.sections ?? []) n += s.articles.length
  return n
}

// ─── Article text renderer ─────────────────────────────────────────────────────

function ArticleText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/)
  return (
    <div className="space-y-3 text-gray-800 leading-relaxed text-sm">
      {paragraphs.map((para, i) => {
        const lines = para.split('\n')
        if (lines.length === 1) {
          return <p key={i}>{para}</p>
        }
        return (
          <div key={i} className="space-y-1">
            {lines.map((line, j) => {
              const isPoint = /^\(([a-z]|\d+)\)/.test(line.trim()) || /^\d+\./.test(line.trim())
              return (
                <p key={j} className={isPoint ? 'pl-4' : ''}>
                  {line}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  selectedId: string | null
  query: string
  onQueryChange: (q: string) => void
  onSelect: (id: string) => void
  filteredIds: Set<string>
}

function Sidebar({ selectedId, query, onQueryChange, onSelect, filteredIds }: SidebarProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const isFiltering = query.trim().length > 0

  return (
    <aside className="w-72 shrink-0 border-r border-gray-200 bg-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-blue-900 text-white shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🇪🇺</span>
          <span className="font-bold text-sm leading-tight">EU AI Act Explorer</span>
        </div>
        <p className="text-blue-200 text-xs">Regulation (EU) 2024/1689</p>
        <p className="text-blue-300 text-xs mt-0.5">113 Articles · 13 Chapters</p>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-100 shrink-0">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search articles…"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
          {query && (
            <button onClick={() => onQueryChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {isFiltering && (
          <p className="text-xs text-gray-500 mt-1.5">{filteredIds.size} article{filteredIds.size !== 1 ? 's' : ''} found</p>
        )}
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {EU_AI_ACT.chapters.map(ch => {
          const color = CHAPTER_COLORS[ch.id] ?? CHAPTER_COLORS['ch-1']
          const chArticles = ch.articles ?? []
          const secArticles = (ch.sections ?? []).flatMap(s => s.articles)
          const allChArt = [...chArticles, ...secArticles]
          if (isFiltering && !allChArt.some(a => filteredIds.has(a.id))) return null

          const isChCollapsed = collapsed.has(ch.id) && !isFiltering

          return (
            <div key={ch.id}>
              {/* Chapter row */}
              <button
                onClick={() => toggle(ch.id)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-gray-50 transition-colors group`}
              >
                <svg
                  className={`w-3 h-3 shrink-0 text-gray-400 transition-transform ${isChCollapsed ? '' : 'rotate-90'}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className={`text-xs font-semibold ${color.text} flex-1 truncate`}>
                  {color.icon} Ch. {ch.number} — {ch.title}
                </span>
                <span className="text-[10px] text-gray-400 shrink-0">{countArticles(ch)}</span>
              </button>

              {!isChCollapsed && (
                <div>
                  {/* Chapter-level articles */}
                  {chArticles.filter(a => !isFiltering || filteredIds.has(a.id)).map(art => (
                    <ArticleRow key={art.id} art={art} selected={selectedId === art.id} depth={1} color={color} onSelect={onSelect} />
                  ))}

                  {/* Sections */}
                  {(ch.sections ?? []).map(sec => {
                    const secVisible = sec.articles.filter(a => !isFiltering || filteredIds.has(a.id))
                    if (isFiltering && secVisible.length === 0) return null
                    const isSecCollapsed = collapsed.has(sec.id) && !isFiltering

                    return (
                      <div key={sec.id}>
                        <button
                          onClick={() => toggle(sec.id)}
                          className="w-full flex items-center gap-2 px-3 py-1 pl-6 text-left hover:bg-gray-50"
                        >
                          <svg
                            className={`w-2.5 h-2.5 shrink-0 text-gray-300 transition-transform ${isSecCollapsed ? '' : 'rotate-90'}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="text-[10px] text-gray-500 font-medium truncate flex-1">{sec.title}</span>
                        </button>

                        {!isSecCollapsed && (
                          <div>
                            {(isFiltering ? secVisible : sec.articles).map(art => (
                              <ArticleRow key={art.id} art={art} selected={selectedId === art.id} depth={2} color={color} onSelect={onSelect} />
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

interface ArticleRowProps {
  art: EUAIActArticle
  selected: boolean
  depth: number
  color: { text: string }
  onSelect: (id: string) => void
}

function ArticleRow({ art, selected, depth, color, onSelect }: ArticleRowProps) {
  const pl = depth === 1 ? 'pl-8' : 'pl-12'
  return (
    <button
      onClick={() => onSelect(art.id)}
      className={`w-full text-left flex items-center gap-1.5 py-1 pr-3 text-xs transition-colors ${pl}
        ${selected
          ? 'bg-indigo-50 text-indigo-700 font-medium border-r-2 border-indigo-500'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
      <span className="shrink-0 text-gray-400 font-mono text-[10px] w-6">{art.number}</span>
      <span className="truncate">{art.title}</span>
    </button>
  )
}

// ─── Landing overview ──────────────────────────────────────────────────────────

function LandingPane({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Hero */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🇪🇺</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">EU AI Act Explorer</h1>
            <p className="text-gray-500 text-sm">Regulation (EU) 2024/1689 of the European Parliament and of the Council</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Articles', value: '113' },
            { label: 'Chapters', value: '13' },
            { label: 'Published', value: '12 Jul 2024' },
            { label: 'Applies from', value: '2 Aug 2026' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-blue-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Key dates */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">⏱ Key Application Dates</h3>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <p className="font-semibold text-amber-900">2 February 2025</p>
              <p className="text-amber-700">Prohibited AI practices (Art. 5) apply</p>
            </div>
            <div>
              <p className="font-semibold text-amber-900">2 August 2025</p>
              <p className="text-amber-700">GPAI model obligations (Ch. V) apply</p>
            </div>
            <div>
              <p className="font-semibold text-amber-900">2 August 2026</p>
              <p className="text-amber-700">Full Regulation applies</p>
            </div>
          </div>
        </div>

        {/* Chapter cards */}
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Browse by Chapter</h2>
        <div className="grid grid-cols-2 gap-3">
          {EU_AI_ACT.chapters.map(ch => {
            const color = CHAPTER_COLORS[ch.id] ?? CHAPTER_COLORS['ch-1']
            const count = countArticles(ch)
            const firstArt = ch.articles?.[0] ?? ch.sections?.[0]?.articles?.[0]

            return (
              <button
                key={ch.id}
                onClick={() => firstArt && onSelect(firstArt.id)}
                className={`text-left p-4 rounded-lg border ${color.border} ${color.bg} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${color.text} mb-1`}>
                      {color.icon} Chapter {ch.number}
                    </p>
                    <p className="text-sm font-medium text-gray-800 leading-snug">{ch.title}</p>
                  </div>
                  <span className={`ml-2 shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${color.badge}`}>
                    {count} art.
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Article pane ──────────────────────────────────────────────────────────────

function ArticlePane({ art, onSelect }: { art: EUAIActArticle; onSelect: (id: string) => void }) {
  const chapter = getChapter(art.chapterId)
  const section = art.sectionId ? getSection(art.chapterId, art.sectionId) : undefined
  const color = CHAPTER_COLORS[art.chapterId] ?? CHAPTER_COLORS['ch-1']
  const { prev, next } = getArticleNeighbors(art.id)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 flex-wrap">
          <span>{chapter?.title}</span>
          {section && (
            <>
              <span>›</span>
              <span className="truncate max-w-xs">{section.title}</span>
            </>
          )}
          <span>›</span>
          <span className="text-gray-600 font-medium">Article {art.number}</span>
        </nav>

        {/* Header */}
        <div className={`rounded-xl border ${color.border} ${color.bg} p-5 mb-6`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`text-xs font-semibold ${color.text} mb-1`}>Article {art.number}</p>
              <h1 className="text-xl font-bold text-gray-900">{art.title}</h1>
            </div>
            <a
              href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              EUR-Lex
            </a>
          </div>

          {/* Tags and date */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {art.tags.map(tag => (
              <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${tagColor(tag)}`}>
                {tag}
              </span>
            ))}
            {art.applicabilityDate && (
              <span className="ml-auto text-[10px] font-semibold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full shrink-0">
                Applies: {art.applicabilityDate}
              </span>
            )}
          </div>
        </div>

        {/* Article text */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <ArticleText text={art.text} />
        </div>

        {/* Prev / Next */}
        <div className="flex items-center justify-between gap-4">
          {prev ? (
            <button
              onClick={() => onSelect(prev.id)}
              className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-sm max-w-[45%]"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="truncate">Art. {prev.number} — {prev.title}</span>
            </button>
          ) : <div />}

          {next ? (
            <button
              onClick={() => onSelect(next.id)}
              className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-sm max-w-[45%] ml-auto"
            >
              <span className="truncate">Art. {next.number} — {next.title}</span>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : <div />}
        </div>
      </div>
    </div>
  )
}

// ─── Root component ────────────────────────────────────────────────────────────

export default function RegulatoryClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const filteredIds = useMemo(() => {
    if (!query.trim()) return new Set(ALL_ARTICLES.map(a => a.id))
    const q = query.toLowerCase()
    return new Set(
      ALL_ARTICLES
        .filter(a =>
          a.number.includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.text.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
        )
        .map(a => a.id)
    )
  }, [query])

  const selectedArt = selectedId ? ALL_ARTICLES.find(a => a.id === selectedId) ?? null : null

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    setQuery('')
  }, [])

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
      <Sidebar
        selectedId={selectedId}
        query={query}
        onQueryChange={setQuery}
        onSelect={id => { setSelectedId(id); }}
        filteredIds={filteredIds}
      />
      {selectedArt
        ? <ArticlePane art={selectedArt} onSelect={handleSelect} />
        : <LandingPane onSelect={handleSelect} />
      }
    </div>
  )
}
