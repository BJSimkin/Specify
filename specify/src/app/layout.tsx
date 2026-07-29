import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'
import { Nav } from '@/components/nav'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Specify — AI Requirements',
  description:
    'The open-source platform for hosting, sharing, and discovering AI system requirements packages.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Specify — AI Requirements',
    description: 'Share and discover structured AI system requirements',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50">
        <SessionProvider session={session}>
          <Nav user={session?.user} />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
