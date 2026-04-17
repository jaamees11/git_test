'use client'

import { getStreakLabel } from '@/lib/progression'

interface StreakPanelProps {
  current: number
  longest: number
  total: number
}

export function StreakPanel({ current, longest, total }: StreakPanelProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard
        icon="🔥"
        value={current}
        label="Day Streak"
        accent="text-game-orange"
        glow="hover:shadow-[0_0_20px_rgba(251,133,0,0.25)]"
        subtitle={getStreakLabel(current)}
      />
      <StatCard
        icon="🏆"
        value={longest}
        label="Longest"
        accent="text-game-gold"
        glow="hover:shadow-[0_0_20px_rgba(255,214,10,0.25)]"
      />
      <StatCard
        icon="💪"
        value={total}
        label="Workouts"
        accent="text-game-accent"
        glow="hover:shadow-[0_0_20px_rgba(76,201,240,0.25)]"
      />
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
  accent,
  glow,
  subtitle,
}: {
  icon: string
  value: number
  label: string
  accent: string
  glow: string
  subtitle?: string
}) {
  return (
    <div
      className={`game-panel rounded-game p-4 text-center transition-all ${glow} hover:-translate-y-0.5`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`font-orbitron font-black text-3xl ${accent}`}>{value}</div>
      <div className="text-xs text-white/50 uppercase tracking-wider mt-1">{label}</div>
      {subtitle && (
        <div className="text-[9px] font-pixel mt-2 text-white/60 truncate" title={subtitle}>
          {subtitle}
        </div>
      )}
    </div>
  )
}
