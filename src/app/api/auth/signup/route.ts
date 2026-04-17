import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createToken, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name: name?.trim() || null,
        passwordHash,
        progress: {
          create: {
            xp: 0,
            level: 1,
            currentStreak: 0,
            longestStreak: 0,
            totalWorkouts: 0,
            avatarStage: 1,
            roomStage: 1,
          },
        },
        activityLog: {
          create: {
            type: 'checkin',
            message: '🏋️ Welcome to Gym World! Your journey starts now.',
          },
        },
      },
    })

    const token = await createToken({ id: user.id, email: user.email, name: user.name })
    setAuthCookie(token)

    return NextResponse.json({ success: true, userId: user.id })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
