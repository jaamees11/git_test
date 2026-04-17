import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTodayString } from '@/lib/utils'
import {
  calculateStreak,
  calculateXPGain,
  buildCheckInResult,
  getAvatarStage,
  getRoomStage,
  getLevelFromXP,
} from '@/lib/progression'
import type { CheckInResult } from '@/types'

export async function POST() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = getTodayString()

  // Check for duplicate check-in today
  const existing = await prisma.workoutCheckIn.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  })
  if (existing) {
    return NextResponse.json({ error: 'Already checked in today!' }, { status: 409 })
  }

  // Get current progress
  const progress = await prisma.userProgress.findUnique({ where: { userId: user.id } })
  if (!progress) return NextResponse.json({ error: 'Progress not found' }, { status: 404 })

  // Get last check-in to calculate streak
  const lastCheckIn = await prisma.workoutCheckIn.findFirst({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  })

  const newStreak = calculateStreak(lastCheckIn?.date ?? null, progress.currentStreak)
  const { base: xpGained, bonus: bonusXP } = calculateXPGain(newStreak)
  const newXP = progress.xp + xpGained + bonusXP
  const newTotalWorkouts = progress.totalWorkouts + 1
  const newLevel = getLevelFromXP(newXP)
  const newAvatarStage = getAvatarStage(newTotalWorkouts)
  const newRoomStage = getRoomStage(newTotalWorkouts)
  const newLongestStreak = Math.max(progress.longestStreak, newStreak)

  const result = buildCheckInResult(progress, newStreak, xpGained, bonusXP)

  // Build activity log entries
  const logs: { type: string; message: string; xpGained?: number }[] = [
    { type: 'checkin', message: `✅ Workout complete! +${xpGained} XP`, xpGained },
  ]
  if (bonusXP > 0) {
    logs.push({
      type: 'streak_milestone',
      message: `🔥 ${newStreak}-day streak! Bonus +${bonusXP} XP`,
      xpGained: bonusXP,
    })
  }
  if (newLevel > progress.level) {
    logs.push({ type: 'level_up', message: `⬆️ Level up! You reached Level ${newLevel}!` })
  }
  if (newAvatarStage > progress.avatarStage) {
    logs.push({ type: 'avatar_upgrade', message: `💪 Avatar upgraded to Stage ${newAvatarStage}!` })
  }
  if (newRoomStage > progress.roomStage) {
    logs.push({ type: 'room_upgrade', message: `🏠 Gym room upgraded to Stage ${newRoomStage}!` })
  }

  // Persist all changes in a transaction
  await prisma.$transaction([
    prisma.workoutCheckIn.create({ data: { userId: user.id, date: today } }),
    prisma.userProgress.update({
      where: { userId: user.id },
      data: {
        xp: newXP,
        level: newLevel,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        totalWorkouts: newTotalWorkouts,
        avatarStage: newAvatarStage,
        roomStage: newRoomStage,
      },
    }),
    prisma.activityLog.createMany({
      data: logs.map(l => ({ userId: user.id, ...l })),
    }),
  ])

  const message = result.isLevelUp
    ? `🎉 LEVEL UP! You're now Level ${newLevel}!`
    : result.isStreakMilestone
    ? `🔥 ${newStreak}-day streak! Keep going!`
    : `✅ Workout logged! +${xpGained + bonusXP} XP`

  const response: CheckInResult = { ...result, success: true, message }
  return NextResponse.json(response)
}
