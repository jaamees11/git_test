import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PROGRESSION_CONFIG } from '@/config/progression'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pbs = await prisma.personalBest.findMany({
    where: { userId: user.id },
    orderBy: { liftName: 'asc' },
  })

  return NextResponse.json({ pbs })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { liftName, value, unit = 'kg', notes } = await req.json()

  if (!liftName?.trim() || !value || isNaN(Number(value))) {
    return NextResponse.json({ error: 'Lift name and valid value are required' }, { status: 400 })
  }
  if (Number(value) <= 0) {
    return NextResponse.json({ error: 'Value must be greater than 0' }, { status: 400 })
  }

  const xpGain = PROGRESSION_CONFIG.xp.pbUpdate

  // Upsert the PB and award XP
  const [pb] = await prisma.$transaction([
    prisma.personalBest.upsert({
      where: { userId_liftName: { userId: user.id, liftName: liftName.trim() } },
      create: { userId: user.id, liftName: liftName.trim(), value: Number(value), unit, notes },
      update: { value: Number(value), unit, notes },
    }),
    prisma.userProgress.update({
      where: { userId: user.id },
      data: { xp: { increment: xpGain } },
    }),
    prisma.activityLog.create({
      data: {
        userId: user.id,
        type: 'pb_update',
        message: `🏆 New PB: ${liftName.trim()} — ${value}${unit}`,
        xpGained: xpGain,
      },
    }),
  ])

  return NextResponse.json({ pb, xpGained: xpGain })
}
