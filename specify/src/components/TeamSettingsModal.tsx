'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface Team {
  id: string
  name: string
  description: string | null
  role: string
}

interface Props {
  onClose: () => void
  onTeamChange: (teamId: string | null, teamName: string | null) => void
  currentTeamId: string | null
}

export default function TeamSettingsModal({ onClose, onTeamChange, currentTeamId }: Props) {
  const { data: session } = useSession()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDesc, setNewTeamDesc] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteTeamId, setInviteTeamId] = useState('')
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)

  const userId = (session?.user as Record<string, unknown>)?.id as string | undefined

  const loadTeams = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch('/api/teams?userId=' + userId)
      const data = await res.json() as { teams: Team[] }
      setTeams(data.teams ?? [])
    } finally { setLoading(false) }
  }, [userId])

  useEffect(() => { loadTeams() }, [loadTeams])

  async function createTeam() {
    if (!newTeamName.trim() || !userId) return
    setCreating(true)
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTeamName.trim(), description: newTeamDesc.trim() || undefined, userId }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setNewTeamName(''); setNewTeamDesc('')
      await loadTeams()
      setMsg({ text: 'Team created!', ok: true })
    } catch (e) { setMsg({ text: String(e), ok: false }) }
    finally { setCreating(false) }
  }

  async function inviteMember() {
    if (!inviteEmail.trim() || !inviteTeamId) return
    try {
      const res = await fetch('/api/teams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: inviteTeamId, email: inviteEmail.trim() }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
      setInviteEmail('')
      setMsg({ text: 'Invite sent!', ok: true })
    } catch (e) { setMsg({ text: String(e), ok: false }) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Team settings</h2>
            <p className="text-xs text-gray-400 mt-0.5">Collaborate on model audits with your team</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Current teams */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Your teams</p>
            {loading ? <p className="text-xs text-gray-400">Loading…</p> : teams.length === 0 ? (
              <p className="text-xs text-gray-400 italic">You&apos;re not in any teams yet.</p>
            ) : (
              <div className="space-y-1.5">
                {teams.map(t => (
                  <div key={t.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer"
                    style={currentTeamId === t.id
                      ? { backgroundColor: '#EEF2FF', borderColor: '#818CF8' }
                      : { borderColor: '#E5E7EB' }}
                    onClick={() => { onTeamChange(t.id, t.name); setMsg({ text: `Switched to ${t.name}`, ok: true }) }}>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                      {t.description && <p className="text-xs text-gray-400">{t.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 capitalize">{t.role}</span>
                      {currentTeamId === t.id && <span className="text-xs text-indigo-500 font-medium">Active</span>}
                      {currentTeamId === t.id && (
                        <button onClick={e => { e.stopPropagation(); onTeamChange(null, null); setMsg({ text: 'Removed team context', ok: true }) }}
                          className="text-xs text-gray-400 hover:text-gray-600">Deselect</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create new team */}
          <div className="border border-gray-200 rounded-xl p-3 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Create a team</p>
            <input value={newTeamName} onChange={e => setNewTeamName(e.target.value)}
              placeholder="Team name (e.g. Red Team Alpha)"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400" />
            <input value={newTeamDesc} onChange={e => setNewTeamDesc(e.target.value)}
              placeholder="Description (optional)"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400" />
            <button onClick={createTeam} disabled={creating || !newTeamName.trim()}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#1E1B4B' }}>
              {creating ? 'Creating…' : 'Create team'}
            </button>
          </div>

          {/* Invite member */}
          {teams.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Invite a team member</p>
              <select value={inviteTeamId} onChange={e => setInviteTeamId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400">
                <option value="">Select team…</option>
                {teams.filter(t => t.role === 'owner' || t.role === 'admin').map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
                type="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400" />
              <button onClick={inviteMember} disabled={!inviteEmail.trim() || !inviteTeamId}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#1E1B4B' }}>
                Invite
              </button>
            </div>
          )}

          {msg && (
            <p className="text-xs px-3 py-2 rounded-lg"
              style={{ backgroundColor: msg.ok ? '#D1FAE5' : '#FEE2E2', color: msg.ok ? '#065F46' : '#991B1B' }}>
              {msg.text}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
