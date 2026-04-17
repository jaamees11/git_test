import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { LogoutButton } from '@/components/ui/LogoutButton'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-game-bg">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-game-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-game-pink/5 rounded-full blur-3xl" />
      </div>

      {/* Top Nav */}
      <header className="sticky top-0 z-30 bg-game-bg/85 backdrop-blur-md border-b border-game-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🏋️</span>
            <span className="font-pixel text-[10px] sm:text-xs text-game-accent tracking-wider">
              GYM WORLD
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink href="/dashboard">🏠 Room</NavLink>
            <NavLink href="/pbs">🏆 PBs</NavLink>
            <NavLink href="/profile">⚙️ Profile</NavLink>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="relative z-10">{children}</main>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-xs sm:text-sm text-white/60 hover:text-white px-2.5 sm:px-3 py-2 rounded-game hover:bg-white/5 transition-colors whitespace-nowrap"
    >
      {children}
    </Link>
  )
}
