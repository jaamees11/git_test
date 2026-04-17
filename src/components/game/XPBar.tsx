'use client'

import { getLevelConfig, getXPProgress } from '@/lib/progression'

interface XPBarProps {
  xp: number
  level: number
  compact?: boolean
}

export function XPBar({ xp, level, compact }: XPBarProps) {
  const { current, max, pct } = getXPProgress(xp)
  const levelConfig = getLevelConfig(level)
  const nextConfig = getLevelConfig(level + 1)

  return (
    <div className={compact ? 'space-y-1.5' : 'space-y-2'}>
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="font-pixel text-[10px] text-game-gold tracking-widest">
            LVL {level}
          </span>
          <span className="text-white font-orbitron font-bold text-sm">
            {levelConfig.label}
          </span>
        </div>
        <div className="text-right">
          <span className="font-orbitron font-black text-white">{xp.toLocaleString()}</span>
          <span className="text-white/40 text-xs ml-1">XP</span>
        </div>
      </div>

      <div className="relative h-3 rounded-full bg-game-panel-alt border border-game-border overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 xp-bar-fill rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 rounded-full pointer-events-none" />
      </div>

      {!compact && (
        <div className="flex justify-between text-[10px] text-white/40 font-mono">
          <span>{current} / {max === 999 ? '∞' : max}</span>
          {nextConfig && nextConfig.minXP !== Infinity ? (
            <span>
              Next: <span className="text-game-accent">{nextConfig.label}</span>
            </span>
          ) : (
            <span className="text-game-gold">MAX RANK</span>
          )}
        </div>
      )}
    </div>
  )
}
