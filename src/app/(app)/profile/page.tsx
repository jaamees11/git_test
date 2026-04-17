import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PROGRESSION_CONFIG } from '@/config/progression'
import { getLevelConfig } from '@/lib/progression'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const authUser = await getCurrentUser()
  if (!authUser) redirect('/login')

  const [user, progress] = await Promise.all([
    prisma.user.findUnique({
      where: { id: authUser.id },
      select: { id: true, email: true, name: true, createdAt: true },
    }),
    prisma.userProgress.findUnique({ where: { userId: authUser.id } }),
  ])

  if (!user || !progress) redirect('/login')

  const levelConfig = getLevelConfig(progress.level)
  const avatarConfig = PROGRESSION_CONFIG.avatarStages.find(s => s.stage === progress.avatarStage)
  const roomConfig = PROGRESSION_CONFIG.roomStages.find(s => s.stage === progress.roomStage)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">⚙️</span>
          <h1 className="font-orbitron font-black text-2xl text-white">Profile</h1>
        </div>
        <p className="text-white/50 text-sm">Your account and progression overview.</p>
      </div>

      {/* Account info */}
      <div className="game-panel rounded-game-lg p-6">
        <h2 className="font-pixel text-xs text-white/60 tracking-widest uppercase mb-4">
          Account
        </h2>
        <div className="space-y-3">
          <Row label="Name" value={user.name || '—'} />
          <Row label="Email" value={user.email} />
          <Row label="Member since" value={format(user.createdAt, 'MMM d, yyyy')} />
        </div>
      </div>

      {/* Current rank */}
      <div className="game-panel-gold rounded-game-lg p-6">
        <h2 className="font-pixel text-xs text-game-gold/70 tracking-widest uppercase mb-4">
          Current Rank
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl mb-1">⭐</div>
            <div className="font-orbitron font-black text-2xl text-game-gold">
              Lv {progress.level}
            </div>
            <div className="text-xs text-white/60 mt-1">{levelConfig.label}</div>
          </div>
          <div>
            <div className="text-3xl mb-1">💪</div>
            <div className="font-orbitron font-black text-2xl text-white">
              {progress.avatarStage}
            </div>
            <div className="text-xs text-white/60 mt-1">{avatarConfig?.label}</div>
          </div>
          <div>
            <div className="text-3xl mb-1">🏠</div>
            <div className="font-orbitron font-black text-2xl text-white">
              {progress.roomStage}
            </div>
            <div className="text-xs text-white/60 mt-1">{roomConfig?.label}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="game-panel rounded-game-lg p-6">
        <h2 className="font-pixel text-xs text-white/60 tracking-widest uppercase mb-4">
          Lifetime Stats
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Stat icon="🔥" label="Current Streak" value={`${progress.currentStreak} days`} />
          <Stat icon="🏆" label="Longest Streak" value={`${progress.longestStreak} days`} />
          <Stat icon="💪" label="Total Workouts" value={progress.totalWorkouts} />
          <Stat icon="⚡" label="Total XP" value={progress.xp.toLocaleString()} />
        </div>
      </div>

      {/* Progression reference */}
      <div className="game-panel rounded-game-lg p-6">
        <h2 className="font-pixel text-xs text-white/60 tracking-widest uppercase mb-4">
          Progression Guide
        </h2>
        <div className="space-y-4">
          <div>
            <div className="text-white/80 font-semibold text-sm mb-2">Avatar Stages</div>
            <div className="grid grid-cols-4 gap-2">
              {PROGRESSION_CONFIG.avatarStages.map(s => (
                <div
                  key={s.stage}
                  className={`text-center p-2 rounded-game border ${
                    s.stage === progress.avatarStage
                      ? 'bg-game-accent/10 border-game-accent text-white'
                      : s.stage < progress.avatarStage
                      ? 'bg-game-panel-alt border-game-border/50 text-white/60'
                      : 'bg-game-panel-alt border-game-border/50 text-white/30'
                  }`}
                >
                  <div className="text-lg">{['🌱', '💪', '⚡', '👑'][s.stage - 1]}</div>
                  <div className="text-[10px] font-pixel">{s.label}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">{s.minWorkouts}+</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white/80 font-semibold text-sm mb-2">Room Stages</div>
            <div className="grid grid-cols-4 gap-2">
              {PROGRESSION_CONFIG.roomStages.map(s => (
                <div
                  key={s.stage}
                  className={`text-center p-2 rounded-game border ${
                    s.stage === progress.roomStage
                      ? 'bg-game-gold/10 border-game-gold text-white'
                      : s.stage < progress.roomStage
                      ? 'bg-game-panel-alt border-game-border/50 text-white/60'
                      : 'bg-game-panel-alt border-game-border/50 text-white/30'
                  }`}
                >
                  <div className="text-lg">{['🏠', '🏡', '🏛️', '🏰'][s.stage - 1]}</div>
                  <div className="text-[10px] font-pixel">{s.label}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">{s.minWorkouts}+</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-4">
        <span className="text-[10px] text-white/30 font-pixel tracking-widest">
          GYM WORLD — KEEP GRINDING
        </span>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-game-border/50 last:border-0">
      <span className="text-white/50 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="bg-game-panel-alt rounded-game p-4 border border-game-border">
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span className="text-[10px] text-white/50 uppercase font-pixel tracking-wider">
          {label}
        </span>
      </div>
      <div className="font-orbitron font-bold text-xl text-white">{value}</div>
    </div>
  )
}
