'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { LogoWithWordmark } from '@/components/logo'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')

  async function handleOAuth(provider: string) {
    setLoadingProvider(provider)
    await signIn(provider, { callbackUrl })
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoadingProvider('email')
    setEmailError('')
    try {
      const res = await signIn('resend', { email: email.trim(), callbackUrl, redirect: false })
      if (res?.error) {
        setEmailError('Could not send magic link. Check your email address and try again.')
      } else {
        setEmailSent(true)
      }
    } catch {
      setEmailError('Something went wrong. Please try again.')
    } finally {
      setLoadingProvider(null)
    }
  }

  const Spinner = () => (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F8F7FF' }}>
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <LogoWithWordmark size={40} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">Welcome to Specify</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in or create an account — it&apos;s the same step.
            </p>
          </div>

          {emailSent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📬</div>
              <h2 className="text-base font-semibold text-gray-900 mb-2">Check your inbox</h2>
              <p className="text-sm text-gray-500">
                We sent a magic link to <strong>{email}</strong>. Click it to sign in — no password needed.
              </p>
              <button
                onClick={() => { setEmailSent(false); setEmail('') }}
                className="mt-4 text-xs text-indigo-600 hover:underline"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Email */}
              <form onSubmit={handleEmailSignIn} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={loadingProvider !== null}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-60"
                    style={{ borderColor: '#D1D5DB' }}
                  />
                </div>
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                <button
                  type="submit"
                  disabled={loadingProvider !== null || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                  style={{ backgroundColor: '#1E1B4B', color: 'white' }}
                >
                  {loadingProvider === 'email' ? <Spinner /> : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  )}
                  Continue with email
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* GitHub */}
              <button
                onClick={() => handleOAuth('github')}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all disabled:opacity-60"
                style={{ backgroundColor: '#24292E', color: 'white', borderColor: '#24292E' }}
              >
                {loadingProvider === 'github' ? <Spinner /> : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                )}
                Continue with GitHub
              </button>

              {/* Google */}
              <button
                onClick={() => handleOAuth('google')}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all disabled:opacity-60"
                style={{ backgroundColor: 'white', color: '#374151', borderColor: '#D1D5DB' }}
              >
                {loadingProvider === 'google' ? <Spinner /> : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Continue with Google
              </button>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
            By continuing, you agree to Specify&apos;s terms. New users get an account automatically.
          </p>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          The open platform for AI system requirements.
        </p>
      </div>
    </div>
  )
}
