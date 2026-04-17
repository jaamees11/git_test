import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gym World — Level Up Your Training',
  description: 'Track your gym consistency, watch your avatar evolve, and level up your world.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;600;700;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-game-bg text-white antialiased min-h-screen">{children}</body>
    </html>
  )
}
