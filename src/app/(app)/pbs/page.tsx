import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PBsClient } from './PBsClient'

export const dynamic = 'force-dynamic'

export default async function PBsPage() {
  const authUser = await getCurrentUser()
  if (!authUser) redirect('/login')

  const pbs = await prisma.personalBest.findMany({
    where: { userId: authUser.id },
    orderBy: { updatedAt: 'desc' },
  })

  const serialised = pbs.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return <PBsClient initialPBs={serialised} />
}
