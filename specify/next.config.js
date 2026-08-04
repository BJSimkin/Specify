/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  serverExternalPackages: ['@prisma/client'],
}
module.exports = nextConfig
