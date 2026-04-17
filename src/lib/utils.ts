import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, isToday, isYesterday } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr)
    if (isToday(d)) return 'Today'
    if (isYesterday(d)) return 'Yesterday'
    return format(d, 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function formatRelativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return format(d, 'MMM d')
  } catch {
    return ''
  }
}

export function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    checkin: '✅',
    pb_update: '🏆',
    level_up: '⬆️',
    streak_milestone: '🔥',
    avatar_upgrade: '💪',
    room_upgrade: '🏠',
  }
  return icons[type] ?? '📝'
}

export function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Build last 30 days for activity calendar
export function buildCalendarDays(checkInDates: string[]): { date: string; completed: boolean }[] {
  const dateSet = new Set(checkInDates)
  const days: { date: string; completed: boolean }[] = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const str = format(d, 'yyyy-MM-dd')
    days.push({ date: str, completed: dateSet.has(str) })
  }

  return days
}
