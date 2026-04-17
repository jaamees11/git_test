'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEFAULT_LIFTS } from '@/config/progression'
import type { PersonalBest } from '@/types'

interface Props {
  initialPBs: PersonalBest[]
}

export function PBsClient({ initialPBs }: Props) {
  const router = useRouter()
  const [pbs, setPBs] = useState<PersonalBest[]>(initialPBs)
  const [liftName, setLiftName] = useState<string>('Bench Press')
  const [customLift, setCustomLift] = useState('')
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState<'kg' | 'lbs' | 'reps'>('kg')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const name = liftName === '__custom__' ? customLift.trim() : liftName
    if (!name) {
      setError('Please select or enter a lift name')
      return
    }
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      setError('Enter a valid value')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/pbs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liftName: name, value: Number(value), unit }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save PB')
        return
      }

      // Update local list
      setPBs(prev => {
        const idx = prev.findIndex(p => p.liftName === name)
        if (idx === -1) return [data.pb, ...prev]
        const copy = [...prev]
        copy[idx] = data.pb
        return copy
      })
      setToast(`🏆 PB saved! +${data.xpGained} XP`)
      setValue('')
      setCustomLift('')
      setTimeout(() => setToast(''), 2800)
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this PB?')) return
    const res = await fetch(`/api/pbs/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setPBs(prev => prev.filter(p => p.id !== id))
      router.refresh()
    }
  }

  const sorted = [...pbs].sort((a, b) => a.liftName.localeCompare(b.liftName))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏆</span>
          <h1 className="font-orbitron font-black text-2xl text-white">Personal Bests</h1>
        </div>
        <p className="text-white/50 text-sm">
          Log your PRs. They appear live on the whiteboard in your gym room.
          Each update earns <span className="text-game-gold font-semibold">+15 XP</span>.
        </p>
      </div>

      {/* Add PB form */}
      <div className="game-panel rounded-game-lg p-5">
        <h2 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
          <span>➕</span> Log or Update a PB
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Lift
              </label>
              <select
                value={liftName}
                onChange={e => setLiftName(e.target.value)}
                className="game-input w-full px-4 py-2.5 rounded-game text-sm"
              >
                {DEFAULT_LIFTS.map(l => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
                <option value="__custom__">+ Custom lift...</option>
              </select>
              {liftName === '__custom__' && (
                <input
                  type="text"
                  placeholder="e.g. Clean & Jerk"
                  value={customLift}
                  onChange={e => setCustomLift(e.target.value)}
                  className="game-input w-full px-4 py-2.5 rounded-game text-sm mt-2"
                />
              )}
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2">
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                  Value
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  placeholder="100"
                  className="game-input w-full px-4 py-2.5 rounded-game text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value as 'kg' | 'lbs' | 'reps')}
                  className="game-input px-3 py-2.5 rounded-game text-sm"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                  <option value="reps">reps</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-game-red/10 border border-game-red/30 text-game-red text-sm px-4 py-2 rounded-game">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-game-gold to-game-orange text-game-bg font-bold px-6 py-3 rounded-game text-sm hover:opacity-90 hover:shadow-[0_0_20px_rgba(255,214,10,0.4)] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : '🏆 Save PB'}
          </button>
        </form>
      </div>

      {/* Existing PBs */}
      <div className="game-panel rounded-game-lg p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-game-border">
          <h2 className="font-orbitron font-bold text-white">Your PBs</h2>
          <span className="text-xs text-white/40">{sorted.length} logged</span>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-2 opacity-60">📋</div>
            <p className="text-white/50 text-sm">No PBs logged yet. Add your first one above!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {sorted.map(pb => (
              <div
                key={pb.id}
                className="flex items-center justify-between bg-game-panel-alt rounded-game px-4 py-3 border border-game-border hover:border-game-border-bright transition-colors"
              >
                <div>
                  <div className="text-white font-semibold text-sm">{pb.liftName}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">
                    Updated {new Date(pb.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-orbitron font-bold text-game-gold text-xl">
                      {pb.value}
                    </div>
                    <div className="text-[10px] text-game-gold/60">{pb.unit}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(pb.id)}
                    className="text-white/30 hover:text-game-red transition-colors text-sm p-1"
                    title="Delete PB"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 game-toast rounded-game px-6 py-3 text-sm font-semibold text-game-gold shadow-game-lg z-50 animate-slide-up">
          {toast}
        </div>
      )}
    </div>
  )
}
