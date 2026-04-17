'use client'

import { useState } from 'react'
import { GymRoom } from '@/components/room/GymRoom'
import { CheckInButton } from '@/components/game/CheckInButton'
import { StreakPanel } from '@/components/game/StreakPanel'
import { XPBar } from '@/components/game/XPBar'
import { PBWhiteboard } from '@/components/game/PBWhiteboard'
import { ActivityFeed } from '@/components/game/ActivityFeed'
import { ActivityCalendar } from '@/components/game/ActivityCalendar'
import { RewardOverlay } from '@/components/game/RewardOverlay'
import { PROGRESSION_CONFIG } from '@/config/progression'
import type {
  User,
  UserProgress,
  PersonalBest,
  ActivityLog,
  WorkoutCheckIn,
  CheckInResult,
} from '@/types'

interface Props {
  user: User
  progress: UserProgress
  personalBests: PersonalBest[]
  recentActivity: ActivityLog[]
  checkIns: WorkoutCheckIn[]
  checkedInToday: boolean
}

export function DashboardClient({
  user,
  progress: initialProgress,
  personalBests,
  recentActivity,
  checkIns,
  checkedInToday: initialCheckedIn,
}: Props) {
  const [progress, setProgress] = useState(initialProgress)
  const [checkedInToday, setCheckedInToday] = useState(initialCheckedIn)
  const [rewardResult, setRewardResult] = useState<CheckInResult | null>(null)

  const avatarStage = progress.avatarStage as 1 | 2 | 3 | 4
  const roomStage = progress.roomStage as 1 | 2 | 3 | 4

  function handleCheckIn(result: CheckInResult) {
    // Optimistic update
    setProgress(prev => ({
      ...prev,
      xp: result.newXP,
      level: result.newLevel,
      currentStreak: result.newStreak,
      longestStreak: Math.max(prev.longestStreak, result.newStreak),
      totalWorkouts: prev.totalWorkouts + 1,
      avatarStage: result.newAvatarStage,
      roomStage: result.newRoomStage,
    }))
    setCheckedInToday(true)
    setRewardResult(result)
  }

  const avatarStageConfig = PROGRESSION_CONFIG.avatarStages.find(s => s.stage === avatarStage)
  const roomStageConfig = PROGRESSION_CONFIG.roomStages.find(s => s.stage === roomStage)

  // Compute next-stage progress
  const nextAvatarStage = PROGRESSION_CONFIG.avatarStages.find(
    s => s.stage === avatarStage + 1
  )
  const avatarProgress = nextAvatarStage
    ? {
        current: progress.totalWorkouts,
        target: nextAvatarStage.minWorkouts,
        pct: Math.min(
          100,
          Math.round((progress.totalWorkouts / nextAvatarStage.minWorkouts) * 100)
        ),
      }
    : null

  return (
    <>
      <RewardOverlay result={rewardResult} onClose={() => setRewardResult(null)} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5">
        {/* Greeting + XP bar */}
        <div className="game-panel rounded-game-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="flex-1">
              <h1 className="font-orbitron font-bold text-xl text-white">
                Welcome back{user.name ? `, ${user.name}` : ''} 👋
              </h1>
              <p className="text-white/50 text-sm mt-0.5">
                {checkedInToday
                  ? "You've crushed today. See you tomorrow."
                  : 'Your avatar is waiting. Log your workout.'}
              </p>
            </div>
          </div>
          <XPBar xp={progress.xp} level={progress.level} />
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-5">
          {/* LEFT COLUMN: Room + stats + check-in */}
          <div className="space-y-5">
            {/* ROOM */}
            <div className="game-panel rounded-game-lg p-3 sm:p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏠</span>
                  <div>
                    <div className="font-orbitron font-bold text-white text-sm">
                      {roomStageConfig?.label ?? 'Gym'}
                    </div>
                    <div className="text-[10px] text-white/40 font-pixel tracking-wider">
                      STAGE {roomStage}/4
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-orbitron font-bold text-white text-sm">
                    {avatarStageConfig?.label ?? 'Avatar'}
                  </div>
                  <div className="text-[10px] text-white/40 font-pixel tracking-wider">
                    AVATAR {avatarStage}/4
                  </div>
                </div>
              </div>

              <GymRoom
                roomStage={roomStage}
                avatarStage={avatarStage}
                pbs={personalBests}
                checkedInToday={checkedInToday}
              />

              {/* Progress toward next avatar stage */}
              {avatarProgress && (
                <div className="mt-3 px-2">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white/50">
                      Next evolution:{' '}
                      <span className="text-game-accent font-semibold">
                        {nextAvatarStage?.label}
                      </span>
                    </span>
                    <span className="text-white/40 font-mono">
                      {avatarProgress.current} / {avatarProgress.target}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-game-panel-alt border border-game-border overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-game-accent to-game-pink transition-all duration-500"
                      style={{ width: `${avatarProgress.pct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Check-in CTA */}
            <CheckInButton checkedIn={checkedInToday} onCheckIn={handleCheckIn} />

            {/* Stats panel */}
            <StreakPanel
              current={progress.currentStreak}
              longest={progress.longestStreak}
              total={progress.totalWorkouts}
            />

            {/* Calendar */}
            <ActivityCalendar checkInDates={checkIns.map(c => c.date)} />
          </div>

          {/* RIGHT COLUMN: PBs + activity */}
          <aside className="space-y-5">
            <PBWhiteboard pbs={personalBests} />
            <ActivityFeed activities={recentActivity} />
          </aside>
        </div>
      </div>
    </>
  )
}
