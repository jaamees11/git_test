'use client'

import { buildCalendarDays, formatDate } from '@/lib/utils'

interface ActivityCalendarProps {
  checkInDates: string[]
}

export function ActivityCalendar({ checkInDates }: ActivityCalendarProps) {
  const days = buildCalendarDays(checkInDates)

  return (
    <div className="game-panel rounded-game p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-game-border">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span className="font-pixel text-xs text-white/60 tracking-widest uppercase">
            Last 30 Days
          </span>
        </div>
        <span className="text-xs text-white/40">
          {days.filter(d => d.completed).length} / 30
        </span>
      </div>

      <div className="grid grid-cols-10 gap-1.5">
        {days.map((d, i) => (
          <div
            key={i}
            title={`${formatDate(d.date)}${d.completed ? ' — completed' : ' — missed'}`}
            className={`calendar-day border ${
              d.completed
                ? 'bg-gradient-to-br from-game-green to-game-green/70 border-game-green shadow-[0_0_6px_rgba(6,214,160,0.35)]'
                : 'bg-game-panel-alt border-game-border/60'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-white/40">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-game-panel-alt border border-game-border" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-game-green" />
          <span>Completed</span>
        </div>
      </div>
    </div>
  )
}
