'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CheckInResult } from '@/types'

interface CheckInButtonProps {
  checkedIn: boolean
  onCheckIn: (result: CheckInResult) => void
}

export function CheckInButton({ checkedIn, onCheckIn }: CheckInButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckIn() {
    if (checkedIn || loading) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/checkin', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Check-in failed')
        return
      }
      onCheckIn(data as CheckInResult)
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (checkedIn) {
    return (
      <div className="w-full rounded-game-lg bg-gradient-to-r from-game-green/20 to-game-green/5 border border-game-green/40 px-6 py-5 text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl animate-float">✅</span>
          <div className="text-left">
            <div className="font-pixel text-xs text-game-green tracking-wider mb-1">
              WORKOUT LOGGED
            </div>
            <div className="text-white/60 text-sm">
              Come back tomorrow to keep the streak alive.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleCheckIn}
        disabled={loading}
        className="checkin-btn group relative w-full bg-gradient-to-r from-game-pink via-game-purple to-game-accent text-white font-bold py-5 rounded-game-lg text-lg transition-all hover:shadow-[0_0_40px_rgba(247,37,133,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait animate-pulse-glow"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Logging workout...
            </>
          ) : (
            <>
              <span className="text-2xl">💪</span>
              <span className="font-orbitron tracking-wide">I COMPLETED MY WORKOUT</span>
            </>
          )}
        </span>
        {/* Shimmer overlay */}
        <span className="absolute inset-0 rounded-game-lg bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
      </button>
      {error && (
        <div className="bg-game-red/10 border border-game-red/30 text-game-red text-sm px-4 py-2 rounded-game text-center">
          {error}
        </div>
      )}
    </div>
  )
}
