'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs sm:text-sm text-white/40 hover:text-game-red px-2.5 sm:px-3 py-2 rounded-game hover:bg-game-red/5 transition-colors"
      title="Log out"
    >
      ↪
    </button>
  )
}
