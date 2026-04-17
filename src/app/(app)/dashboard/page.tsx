import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTodayString } from '@/lib/utils'
import { DashboardClient } from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const authUser = await getCurrentUser()
  if (!authUser) redirect('/login')

  // Fetch everything in parallel
  const [user, progress, personalBests, recentActivity, checkIns] = await Promise.all([
    prisma.user.findUnique({
      where: { id: authUser.id },
      select: { id: true, email: true, name: true, createdAt: true },
    }),
    prisma.userProgress.findUnique({ where: { userId: authUser.id } }),
    prisma.personalBest.findMany({
      where: { userId: authUser.id },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.activityLog.findMany({
      where: { userId: authUser.id },
      orderBy: { createdAt: 'desc' },
      take: 12,
    }),
    prisma.workoutCheckIn.findMany({
      where: { userId: authUser.id },
      orderBy: { date: 'desc' },
      take: 30,
    }),
  ])

  if (!user || !progress) redirect('/login')

  const today = getTodayString()
  const checkedInToday = checkIns.some(c => c.date === today)

  // Serialise dates for the client
  const sProgress = {
    ...progress,
    updatedAt: progress.updatedAt.toISOString(),
  }
  const sPBs = personalBests.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))
  const sActivity = recentActivity.map(a => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }))
  const sCheckIns = checkIns.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }))
  const sUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
  }

  return (
    <DashboardClient
      user={sUser}
      progress={sProgress}
      personalBests={sPBs}
      recentActivity={sActivity as any}
      checkIns={sCheckIns}
      checkedInToday={checkedInToday}
    />
  )
}
