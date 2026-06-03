import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const company = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Hunter Valley Solar'

export const metadata: Metadata = {
  title: `Free Solar Quote — ${company}`,
  description: `Get a free solar quote from ${company}. Locally owned and operated in the Hunter Valley, NSW. Save on your electricity bills with quality solar installation.`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
