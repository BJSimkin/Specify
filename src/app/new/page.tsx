import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import PackageFormClient from './package-form-client'

export const metadata = {
  title: 'New package — Specify',
}

export default async function NewPackagePage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  return <PackageFormClient mode="new" />
}
