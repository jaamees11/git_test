import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTodayString } from '@/lib/utils'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [dbUser, progress, personalBests, recentActivity, checkIns] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, createdAt: true },
    }),
    prisma.userProgress.findUnique({ where: { userId: user.id } }),
    prisma.personalBest.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 15,
    }),
    prisma.workoutCheckIn.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 30,
    }),
  ])

  const today = getTodayString()
  const checkedInToday = checkIns.some(c => c.date === today)

  return NextResponse.json({
    user: dbUser,
    progress,
    personalBests,
    recentActivity,
    checkIns,
    checkedInToday,
  })
}
