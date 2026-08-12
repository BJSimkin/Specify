'use client'

import Link from 'next/link'

interface Contributor {
  id: string; name: string | null; username: string | null; image: string | null
  org: string | null; totalStars: number; totalForks: number; packageCount: number; initials: string
}
interface Benchmark {
  modelName: string; modelVersion: string | null; provider: string | null
  totalSamples: number; totalPass: number; passRate: number
}
interface Props {
  contributors: Contributor[]
  benchmarks: Benchmark[]
  formatNumber: (n: number) => string
}

function PassBar({ rate }: { rate: number }) {
  const color = rate >= 80 ? '#16A34A' : rate >= 60 ? '#D97706' : '#DC2626'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-1.5 rounded-full" style={{ width: `${rate}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-10 text-right" style={{ color }}>{rate}%</span>
    </div>
  )
}

export default function HomepageClient({ contributors, benchmarks, formatNumber }: Props) {
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#1E1B4B' }}>
          The open platform for AI system requirements
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-6">
          Sequel helps teams document, share, and validate AI requirements packages — covering risks, controls, benchmarks, and regulatory compliance.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/" className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ backgroundColor: '#1E1B4B', color: 'white' }}>
            Explore packages
          </Link>
          <Link href="/new" className="px-6 py-2.5 rounded-lg text-sm font-semibold border transition-colors border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-700">
            Create a package
          </Link>
        </div>
      </div>

      {/* Leaderboards side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contributor leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: '#1E1B4B' }}>Top contributors</h2>
            <Link href="/leaderboard" className="text-xs text-indigo-600 hover:underline">View all →</Link>
          </div>
          {contributors.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
              No contributors yet — publish a package to appear here.
            </div>
          ) : (
            <div className="space-y-2">
              {contributors.map((user, idx) => (
                <div key={user.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors hover:border-indigo-200"
                  style={{ borderColor: idx < 3 ? '#E0E7FF' : '#F3F4F6' }}>
                  <div className="w-7 text-center flex-shrink-0">
                    {idx < 3
                      ? <span className="text-base">{medals[idx]}</span>
                      : <span className="text-xs font-bold text-gray-400">#{idx + 1}</span>}
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: '#1E1B4B', color: '#F59E0B' }}>
                    {user.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={user.image} alt="" className="w-full h-full object-cover" />
                      : user.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/${user.username}`} className="text-sm font-semibold text-gray-900 hover:text-indigo-600 truncate block">
                      {user.name ?? user.username}
                    </Link>
                    {user.org && <p className="text-xs text-gray-400 truncate">{user.org}</p>}
                  </div>
                  <div className="flex gap-3 text-xs flex-shrink-0">
                    <span className="flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                      <span className="font-semibold text-gray-700">{formatNumber(user.totalStars)}</span>
                    </span>
                    <span className="text-gray-400">{formatNumber(user.packageCount)} pkg{user.packageCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Model benchmark leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: '#1E1B4B' }}>Model safety benchmarks</h2>
            <Link href="/leaderboard" className="text-xs text-indigo-600 hover:underline">Submit results →</Link>
          </div>
          {benchmarks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
              No results yet.{' '}
              <Link href="/self-audit" className="text-indigo-600 hover:underline">Run the self audit</Link>
              {' '}and submit your model&apos;s score.
            </div>
          ) : (
            <div className="space-y-2">
              {benchmarks.map((m, idx) => (
                <div key={`${m.modelName}${m.modelVersion}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                  style={{ borderColor: idx < 3 ? '#DCFCE7' : '#F3F4F6' }}>
                  <div className="w-7 text-center flex-shrink-0">
                    {idx < 3
                      ? <span className="text-base">{medals[idx]}</span>
                      : <span className="text-xs font-bold text-gray-400">#{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{m.modelName}</span>
                      {m.modelVersion && <span className="text-xs text-gray-400">{m.modelVersion}</span>}
                      {m.provider && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: '#EEF2FF', color: '#3730A3' }}>{m.provider}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{m.totalSamples.toLocaleString()} prompts tested</p>
                    <PassBar rate={m.passRate} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
        {[
          { label: 'Risk Repository', href: '/risk-repository', icon: '⚠️', desc: 'Community-rated AI risks' },
          { label: 'Self Audit', href: '/self-audit', icon: '🧪', desc: '5,273 test prompts' },
          { label: 'Hazards & Controls', href: '/hazards', icon: '🛡️', desc: 'Mitigation mappings' },
          { label: 'Regulatory DB', href: '/regulatory', icon: '⚖️', desc: 'Legal requirements' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all">
            <div className="text-2xl mb-1">{item.icon}</div>
            <p className="text-sm font-semibold text-gray-900">{item.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
