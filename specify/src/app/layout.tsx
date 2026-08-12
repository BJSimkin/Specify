import type { Metadata } from 'next'
import { Inter, Playfair_Display, DM_Mono } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'
import { Nav } from '@/components/nav'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-dm-mono' })

export const metadata: Metadata = {
  title: 'Sequel — AI Safety Evaluation',
  description:
    'AI safety evaluation at every level — from isolated model to deployed system.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Sequel — AI Safety Evaluation',
    description: 'AI safety evaluation at every level — from isolated model to deployed system.',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dmMono.variable}`}>
      <body className="min-h-screen" style={{ backgroundColor: 'var(--bone)' }}>
        <SessionProvider session={session}>
          <Nav user={session?.user} />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
