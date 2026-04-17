'use client'

import type { ActivityLog } from '@/types'
import { formatRelativeTime, getActivityIcon } from '@/lib/utils'

interface ActivityFeedProps {
  activities: ActivityLog[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="game-panel rounded-game p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-game-border">
        <span>📜</span>
        <span className="font-pixel text-xs text-white/60 tracking-widest uppercase">
          Recent Activity
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-white/40 text-sm">Your activity will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {activities.map(act => (
            <div
              key={act.id}
              className="flex items-start gap-3 bg-game-panel-alt rounded-game px-3 py-2.5 border border-game-border/50 hover:border-game-border transition-colors"
            >
              <span className="text-lg mt-0.5 shrink-0">{getActivityIcon(act.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/90 leading-snug">{act.message}</p>
                <p className="text-[10px] text-white/40 mt-0.5">
                  {formatRelativeTime(act.createdAt)}
                </p>
              </div>
              {act.xpGained != null && act.xpGained > 0 && (
                <span className="text-[10px] font-pixel text-game-accent shrink-0 mt-1">
                  +{act.xpGained}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
