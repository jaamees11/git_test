'use client'

import Link from 'next/link'
import type { PersonalBest } from '@/types'

interface PBWhiteboardProps {
  pbs: PersonalBest[]
}

export function PBWhiteboard({ pbs }: PBWhiteboardProps) {
  const sorted = [...pbs].sort((a, b) => a.liftName.localeCompare(b.liftName))

  return (
    <div className="game-panel rounded-game p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-game-border">
        <div className="flex items-center gap-2">
          <span>🏆</span>
          <span className="font-pixel text-xs text-white/60 tracking-widest uppercase">
            Personal Bests
          </span>
        </div>
        <Link
          href="/pbs"
          className="text-xs text-game-accent hover:text-game-accent/80 transition-colors font-semibold"
        >
          Manage →
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-3xl mb-2 opacity-60">📋</div>
          <p className="text-white/50 text-sm mb-3">No PBs logged yet.</p>
          <Link
            href="/pbs"
            className="inline-block bg-game-gold text-game-bg font-bold text-xs px-4 py-2 rounded-game hover:opacity-90 transition-opacity"
          >
            + Log First PB (+15 XP)
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.slice(0, 6).map(pb => (
            <div
              key={pb.id}
              className="flex items-center justify-between bg-game-panel-alt rounded-game px-3 py-2.5 border border-game-border hover:border-game-border-bright transition-colors"
            >
              <span className="text-white/80 text-sm font-medium truncate">
                {pb.liftName}
              </span>
              <span className="font-orbitron font-bold text-game-gold">
                {pb.value}
                <span className="text-game-gold/60 text-xs ml-0.5">{pb.unit}</span>
              </span>
            </div>
          ))}
          {sorted.length > 6 && (
            <Link
              href="/pbs"
              className="block text-center text-xs text-white/40 hover:text-white/60 pt-2"
            >
              + {sorted.length - 6} more
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
