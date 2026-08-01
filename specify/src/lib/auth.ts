import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { generateUsername } from '@/lib/utils'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? 'noreply@specify.dev',
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true, org: true, bio: true },
        })
        if (dbUser) {
          ;(session.user as typeof session.user & { username?: string; org?: string; bio?: string }).username =
            dbUser.username ?? undefined
          ;(session.user as typeof session.user & { org?: string }).org = dbUser.org ?? undefined
          ;(session.user as typeof session.user & { bio?: string }).bio = dbUser.bio ?? undefined
        }
      }
      return session
    },
    async signIn({ user, account }) {
      if (!user.email) return true

      const existing = await prisma.user.findUnique({
        where: { email: user.email },
        select: { id: true, username: true },
      })

      if (!existing?.username) {
        const username = await generateUniqueUsername(user.name ?? '', user.email)
        if (existing) {
          await prisma.user.update({
            where: { id: existing.id },
            data: { username },
          })
        }
      }

      if (account?.provider === 'github' && account.providerAccountId) {
        await prisma.user.updateMany({
          where: { email: user.email },
          data: { githubId: account.providerAccountId },
        })
      }
      if (account?.provider === 'google' && account.providerAccountId) {
        await prisma.user.updateMany({
          where: { email: user.email },
          data: { googleId: account.providerAccountId },
        })
      }

      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'database',
  },
})

async function generateUniqueUsername(name: string, email: string): Promise<string> {
  const base = generateUsername(name, email)
  let candidate = base
  let attempt = 0

  while (true) {
    const existing = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    })
    if (!existing) return candidate
    attempt++
    candidate = `${base}${attempt}`
  }
}

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user) return null

  const user = await prisma.user.findUnique({
    where: { id: (session.user as { id: string }).id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      username: true,
      org: true,
      bio: true,
      createdAt: true,
    },
  })

  return user
}

