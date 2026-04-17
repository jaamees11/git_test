'use client'

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-game-accent text-game-bg font-bold hover:bg-game-accent/90 hover:shadow-[0_0_20px_rgba(76,201,240,0.4)]',
  secondary:
    'bg-game-panel border border-game-border text-white hover:border-game-border-bright hover:bg-game-panel-alt',
  gold:
    'bg-gradient-to-r from-game-gold to-game-orange text-game-bg font-bold hover:opacity-90 hover:shadow-[0_0_20px_rgba(255,214,10,0.4)]',
  danger:
    'bg-game-red/20 border border-game-red/40 text-game-red hover:bg-game-red/30',
  ghost:
    'text-white/60 hover:text-white hover:bg-white/5',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-game',
  lg: 'px-7 py-3.5 text-base rounded-game',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-200 font-semibold',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  )
}
