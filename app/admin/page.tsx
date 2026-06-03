'use client'

import { useState } from 'react'

interface Lead {
  id: number
  name: string
  phone: string
  email: string
  suburb: string
  owns_home: string
  electricity_bill: string
  roof_type: string
  timeline: string
  interested_in_battery: string
  message: string
  score: number
  grade: 'Hot' | 'Warm' | 'Cold'
  created_at: string
}

const BILL: Record<string, string> = {
  'over-600': '$600+', '300-600': '$300–600', '150-300': '$150–300', 'under-150': '<$150',
}
const TIMELINE: Record<string, string> = {
  asap: 'ASAP', '1-3-months': '1–3 mo', '3-6-months': '3–6 mo', 'just-researching': 'Researching',
}
const OWNS: Record<string, string> = {
  outright: 'Owns outright', mortgage: 'Mortgage', renting: 'Renting', other: 'Other',
}
const BATTERY: Record<string, string> = {
  yes: 'Yes', maybe: 'Maybe', no: 'No',
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'All' | 'Hot' | 'Warm' | 'Cold'>('All')
  const [expanded, setExpanded] = useState<number | null>(null)

  async function login() {
    if (!password) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/leads?key=${encodeURIComponent(password)}`)
      if (res.status === 401) { setError('Incorrect password'); setLoading(false); return }
      const data = await res.json()
      setLeads(data)
      setAuthed(true)
    } catch {
      setError('Connection error — please try again.')
    }
    setLoading(false)
  }

  function exportCSV() {
    const headers = ['ID', 'Grade', 'Score', 'Name', 'Phone', 'Email', 'Suburb', 'Owns Home', 'Bill (Qtr)', 'Roof', 'Timeline', 'Battery', 'Message', 'Submitted']
    const rows = leads.map(l => [
      l.id, l.grade, l.score, l.name, l.phone, l.email, l.suburb,
      OWNS[l.owns_home] || l.owns_home,
      BILL[l.electricity_bill] || l.electricity_bill,
      l.roof_type,
      TIMELINE[l.timeline] || l.timeline,
      BATTERY[l.interested_in_battery] || l.interested_in_battery,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      l.created_at,
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `solar-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F2A4E] to-[#163760] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">☀️</div>
            <h1 className="text-2xl font-extrabold text-[#0F2A4E]">Solar Leads Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Enter your admin password to view leads</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Admin password"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Loading...' : 'View Leads'}
          </button>
        </div>
      </div>
    )
  }

  const filtered = filter === 'All' ? leads : leads.filter(l => l.grade === filter)
  const counts = {
    All: leads.length,
    Hot: leads.filter(l => l.grade === 'Hot').length,
    Warm: leads.filter(l => l.grade === 'Warm').length,
    Cold: leads.filter(l => l.grade === 'Cold').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-[#0F2A4E]">☀️ Solar Leads Dashboard</h1>
        <button
          onClick={exportCSV}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          ↓ Export CSV
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Leads', value: counts.All, accent: 'border-blue-500' },
            { label: '🔥 Hot', value: counts.Hot, accent: 'border-red-500' },
            { label: '☀️ Warm', value: counts.Warm, accent: 'border-amber-500' },
            { label: '❄️ Cold', value: counts.Cold, accent: 'border-slate-400' },
          ].map(s => (
            <div key={s.label} className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${s.accent}`}>
              <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(['All', 'Hot', 'Warm', 'Cold'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === f ? 'bg-amber-500 text-white shadow' : 'bg-white text-gray-500 hover:bg-gray-100 border'
              }`}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📭</div>
              <p>{leads.length === 0 ? "No leads yet — share your landing page to get started!" : `No ${filter} leads.`}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Grade', 'Name', 'Phone', 'Suburb', 'Bill', 'Timeline', 'Score', 'Date'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <>
                      <tr
                        key={lead.id}
                        onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                        className="border-b cursor-pointer hover:bg-amber-50/40 transition-colors"
                      >
                        <td className="px-4 py-3"><GradeBadge grade={lead.grade} /></td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900">{lead.name}</div>
                          <div className="text-gray-400 text-xs">{lead.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={`tel:${lead.phone.replace(/\s/g, '')}`}
                            onClick={e => e.stopPropagation()}
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            {lead.phone}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{lead.suburb}</td>
                        <td className="px-4 py-3 text-gray-600">{BILL[lead.electricity_bill] || lead.electricity_bill}</td>
                        <td className="px-4 py-3 text-gray-600">{TIMELINE[lead.timeline] || lead.timeline}</td>
                        <td className="px-4 py-3">
                          <ScoreBar score={lead.score} />
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString('en-AU')}
                        </td>
                      </tr>
                      {expanded === lead.id && (
                        <tr key={`${lead.id}-detail`} className="bg-amber-50/60 border-b">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="grid sm:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400 text-xs uppercase font-semibold">Home ownership</span>
                                <p className="text-gray-700 mt-0.5">{OWNS[lead.owns_home] || lead.owns_home}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 text-xs uppercase font-semibold">Roof type</span>
                                <p className="text-gray-700 mt-0.5">{lead.roof_type}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 text-xs uppercase font-semibold">Battery interest</span>
                                <p className="text-gray-700 mt-0.5">{BATTERY[lead.interested_in_battery] || lead.interested_in_battery}</p>
                              </div>
                              {lead.message && (
                                <div className="sm:col-span-3">
                                  <span className="text-gray-400 text-xs uppercase font-semibold">Their message</span>
                                  <p className="text-gray-700 mt-0.5 italic">"{lead.message}"</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GradeBadge({ grade }: { grade: 'Hot' | 'Warm' | 'Cold' }) {
  const styles = {
    Hot: 'bg-red-100 text-red-700 border border-red-200',
    Warm: 'bg-amber-100 text-amber-700 border border-amber-200',
    Cold: 'bg-blue-100 text-blue-700 border border-blue-200',
  }
  const icons = { Hot: '🔥', Warm: '☀️', Cold: '❄️' }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${styles[grade]}`}>
      {icons[grade]} {grade}
    </span>
  )
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-red-500' : score >= 45 ? 'bg-amber-500' : 'bg-blue-400'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="font-bold text-gray-700 text-xs">{score}</span>
    </div>
  )
}
