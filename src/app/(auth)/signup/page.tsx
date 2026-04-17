'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Signup failed')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-game-bg flex items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-game-pink/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">🏋️</span>
            <span className="font-pixel text-game-accent text-xs">GYM WORLD</span>
          </Link>
          <h1 className="font-orbitron font-black text-2xl text-white mb-2">Create Your Gym</h1>
          <p className="text-white/50 text-sm">Your avatar starts here. The gains start today.</p>
        </div>

        <div className="game-panel p-8 rounded-2xl">
          {/* Progression preview */}
          <div className="flex justify-between mb-8 px-2">
            {['🌱', '💪', '⚡', '👑'].map((icon, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${i === 0 ? 'bg-game-accent/20 border border-game-accent/50' : 'bg-game-panel border border-game-border opacity-40'}`}
                >
                  {icon}
                </div>
                {i < 3 && (
                  <div className="w-full h-px bg-game-border mt-1" style={{ width: '2rem' }} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Trainer Name"
                className="game-input w-full px-4 py-3 rounded-game text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="game-input w-full px-4 py-3 rounded-game text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
                className="game-input w-full px-4 py-3 rounded-game text-sm"
              />
            </div>

            {error && (
              <div className="bg-game-red/10 border border-game-red/30 text-game-red text-sm px-4 py-3 rounded-game">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-game-pink to-game-purple text-white font-bold py-3.5 rounded-game text-sm hover:opacity-90 transition-all hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Building your gym...' : '🚀 Start Training Now'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-game-border text-center">
            <p className="text-white/40 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-game-accent hover:underline font-semibold">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
