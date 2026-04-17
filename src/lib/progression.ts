import { PROGRESSION_CONFIG } from '@/config/progression'
import type { UserProgress, CheckInResult } from '@/types'
import { differenceInCalendarDays } from 'date-fns'

export function getLevelFromXP(xp: number): number {
  const levels = [...PROGRESSION_CONFIG.levels].reverse()
  for (const l of levels) {
    if (xp >= l.minXP) return l.level
  }
  return 1
}

export function getLevelConfig(level: number) {
  return PROGRESSION_CONFIG.levels.find(l => l.level === level) ?? PROGRESSION_CONFIG.levels[0]
}

export function getXPProgress(xp: number): { current: number; max: number; pct: number } {
  const level = getLevelFromXP(xp)
  const config = getLevelConfig(level)
  const nextConfig = getLevelConfig(level + 1)

  if (!nextConfig || nextConfig.minXP === Infinity) {
    return { current: xp - config.minXP, max: 999, pct: 100 }
  }
  const current = xp - config.minXP
  const max = nextConfig.minXP - config.minXP
  return { current, max, pct: Math.min(100, Math.round((current / max) * 100)) }
}

export function getAvatarStage(totalWorkouts: number): number {
  const stages = [...PROGRESSION_CONFIG.avatarStages].reverse()
  for (const s of stages) {
    if (totalWorkouts >= s.minWorkouts) return s.stage
  }
  return 1
}

export function getRoomStage(totalWorkouts: number): number {
  const stages = [...PROGRESSION_CONFIG.roomStages].reverse()
  for (const s of stages) {
    if (totalWorkouts >= s.minWorkouts) return s.stage
  }
  return 1
}

export function calculateStreak(
  lastCheckInDate: string | null,
  currentStreak: number
): number {
  if (!lastCheckInDate) return 1

  const today = new Date()
  const last = new Date(lastCheckInDate)
  const diff = differenceInCalendarDays(today, last)

  if (diff === 1) return currentStreak + 1
  if (diff === 0) return currentStreak
  return 1 // streak broken
}

export function calculateXPGain(newStreak: number): { base: number; bonus: number; total: number } {
  const base = PROGRESSION_CONFIG.xp.dailyCheckIn
  const isStreakMilestone = PROGRESSION_CONFIG.streakMilestones.some(m => m === newStreak)
  const bonus = isStreakMilestone ? PROGRESSION_CONFIG.xp.streakMilestoneBonus : 0
  return { base, bonus, total: base + bonus }
}

export function buildCheckInResult(
  prev: UserProgress,
  newStreak: number,
  xpGained: number,
  bonusXP: number
): Omit<CheckInResult, 'success' | 'message'> {
  const newXP = prev.xp + xpGained + bonusXP
  const newLevel = getLevelFromXP(newXP)
  const newAvatarStage = getAvatarStage(prev.totalWorkouts + 1)
  const newRoomStage = getRoomStage(prev.totalWorkouts + 1)

  return {
    xpGained,
    bonusXP,
    newXP,
    newLevel,
    oldLevel: prev.level,
    newStreak,
    isStreakMilestone: bonusXP > 0,
    milestoneValue: bonusXP > 0 ? newStreak : undefined,
    isLevelUp: newLevel > prev.level,
    isAvatarUpgrade: newAvatarStage > prev.avatarStage,
    isRoomUpgrade: newRoomStage > prev.roomStage,
    newAvatarStage,
    newRoomStage,
  }
}

export function getStreakLabel(streak: number): string {
  if (streak >= 365) return '🌟 LEGENDARY'
  if (streak >= 90) return '🔥 ON FIRE'
  if (streak >= 30) return '⚡ UNSTOPPABLE'
  if (streak >= 14) return '💪 DEDICATED'
  if (streak >= 7) return '🎯 WEEK WARRIOR'
  if (streak >= 3) return '🔥 HEATING UP'
  return '🌱 STARTING OUT'
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`
  return `${xp}`
}
