import { cn } from '@/lib/utils'

interface GameCardProps {
  children: React.ReactNode
  className?: string
  gold?: boolean
  glow?: 'blue' | 'gold' | 'pink' | 'green'
  title?: string
  titleIcon?: string
}

export function GameCard({ children, className, gold, glow, title, titleIcon }: GameCardProps) {
  const glowStyles: Record<string, string> = {
    blue: 'border-game-accent/30 shadow-[0_0_20px_rgba(76,201,240,0.15)]',
    gold: 'border-game-gold/30 shadow-[0_0_20px_rgba(255,214,10,0.15)]',
    pink: 'border-game-pink/30 shadow-[0_0_20px_rgba(247,37,133,0.15)]',
    green: 'border-game-green/30 shadow-[0_0_20px_rgba(6,214,160,0.15)]',
  }

  return (
    <div
      className={cn(
        'game-panel rounded-game p-5',
        gold && 'game-panel-gold',
        glow && glowStyles[glow],
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-game-border">
          {titleIcon && <span>{titleIcon}</span>}
          <span className="font-pixel text-xs text-white/50 tracking-widest uppercase">{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}
