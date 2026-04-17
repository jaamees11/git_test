'use client'

import { useEffect, useState } from 'react'
import type { CheckInResult } from '@/types'

interface RewardOverlayProps {
  result: CheckInResult | null
  onClose: () => void
}

/**
 * Full-screen reward celebration that fires after a successful check-in.
 * Shows XP gained, streak milestones, level-ups, and stage unlocks.
 */
export function RewardOverlay({ result, onClose }: RewardOverlayProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (result) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 4500)
      return () => clearTimeout(t)
    }
  }, [result])

  useEffect(() => {
    if (!visible && result) {
      const t = setTimeout(onClose, 500)
      return () => clearTimeout(t)
    }
  }, [visible, result, onClose])

  if (!result) return null

  const totalXP = result.xpGained + result.bonusXP

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 pointer-events-none transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={() => setVisible(false)}
    >
      {/* Backdrop flash */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-game-pink/20 via-game-purple/20 to-game-accent/20 backdrop-blur-sm ${visible ? 'animate-fade-in' : ''}`}
      />

      {/* Confetti sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <Sparkle key={i} index={i} />
        ))}
      </div>

      {/* Reward card */}
      <div
        className={`relative game-panel rounded-2xl p-8 max-w-sm w-full text-center shadow-game-lg pointer-events-auto ${visible ? 'animate-bounce-in' : ''}`}
      >
        {/* Top icon */}
        <div className="text-6xl mb-4 animate-float">
          {result.isLevelUp ? '🎉' : result.isStreakMilestone ? '🔥' : '💪'}
        </div>

        <h2 className="font-orbitron font-black text-2xl text-white mb-2">
          {result.isLevelUp
            ? 'LEVEL UP!'
            : result.isAvatarUpgrade
            ? 'AVATAR EVOLVED!'
            : result.isRoomUpgrade
            ? 'ROOM UPGRADED!'
            : result.isStreakMilestone
            ? 'STREAK MILESTONE!'
            : 'WORKOUT LOGGED!'}
        </h2>

        <p className="text-white/60 text-sm mb-6">{result.message}</p>

        {/* XP gain display */}
        <div className="bg-game-panel-alt rounded-game p-4 mb-4 border border-game-accent/30">
          <div className="text-xs text-white/50 font-pixel tracking-widest mb-1">XP EARNED</div>
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-orbitron font-black text-4xl text-game-accent glow-blue">
              +{totalXP}
            </span>
            <span className="text-white/40 text-sm">XP</span>
          </div>
          {result.bonusXP > 0 && (
            <div className="text-game-gold text-xs mt-2 font-semibold">
              🎁 +{result.bonusXP} streak bonus!
            </div>
          )}
        </div>

        {/* Stat highlights */}
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="bg-game-panel-alt rounded-game p-3">
            <div className="text-[10px] text-white/40 uppercase font-pixel">Streak</div>
            <div className="font-orbitron font-bold text-game-orange text-lg">
              {result.newStreak} 🔥
            </div>
          </div>
          <div className="bg-game-panel-alt rounded-game p-3">
            <div className="text-[10px] text-white/40 uppercase font-pixel">Level</div>
            <div className="font-orbitron font-bold text-game-gold text-lg">
              {result.newLevel}
              {result.isLevelUp && <span className="text-xs ml-1">↑</span>}
            </div>
          </div>
        </div>

        {/* Unlocks */}
        {(result.isAvatarUpgrade || result.isRoomUpgrade) && (
          <div className="mt-4 pt-4 border-t border-game-border">
            <div className="text-xs text-game-gold font-pixel tracking-widest mb-2">
              🔓 UNLOCKED
            </div>
            {result.isAvatarUpgrade && (
              <div className="text-white text-sm">
                💪 Avatar Stage {result.newAvatarStage}
              </div>
            )}
            {result.isRoomUpgrade && (
              <div className="text-white text-sm">
                🏠 Gym Stage {result.newRoomStage}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setVisible(false)}
          className="mt-6 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          Tap to close
        </button>
      </div>
    </div>
  )
}

function Sparkle({ index }: { index: number }) {
  const colors = ['#FFD60A', '#F72585', '#4CC9F0', '#06D6A0', '#7209B7']
  const color = colors[index % colors.length]
  const size = 4 + Math.random() * 8
  const left = Math.random() * 100
  const duration = 1.5 + Math.random() * 1.5
  const delay = Math.random() * 0.3

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: `${left}%`,
        width: size,
        height: size,
        background: color,
        borderRadius: '50%',
        boxShadow: `0 0 8px ${color}`,
        animation: `confetti ${duration}s ease-out ${delay}s forwards`,
      }}
    >
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(0);
            opacity: 1;
          }
          20% {
            transform: translateY(-20px) translateX(${(Math.random() - 0.5) * 40}px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(600px) translateX(${(Math.random() - 0.5) * 200}px) rotate(720deg) scale(0.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
