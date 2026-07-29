import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import PackageFormClient from '@/app/new/package-form-client'
import type { PackageFormData } from '@/types'
import { Obligation } from '@prisma/client'

interface PageProps {
  params: { author: string; slug: string }
}

export default async function EditPackagePage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  const userId = (session.user as { id: string }).id
  const fullSlug = `${params.author}/${params.slug}`

  const pkg = await prisma.package.findUnique({
    where: { slug: fullSlug },
    include: {
      requirements: {
        orderBy: { order: 'asc' },
        include: { subRequirements: { orderBy: { order: 'asc' } } },
      },
      tags: true,
    },
  })

  if (!pkg) notFound()
  if (pkg.authorId !== userId) redirect(`/packages/${fullSlug}`)

  const formData: PackageFormData = {
    name: pkg.name,
    description: pkg.description ?? '',
    version: pkg.currentVersion,
    license: pkg.license,
    useCases: pkg.tags.filter((t) => t.category === 'USE_CASE').map((t) => t.value),
    industries: pkg.tags.filter((t) => t.category === 'INDUSTRY').map((t) => t.value),
    modelTypes: pkg.tags.filter((t) => t.category === 'MODEL_TYPE').map((t) => t.value),
    deploymentEnvs: pkg.tags.filter((t) => t.category === 'DEPLOYMENT_ENV').map((t) => t.value),
    riskTier: pkg.tags.find((t) => t.category === 'RISK_TIER')?.value ?? '',
    customTags: pkg.tags.filter((t) => t.category === 'CUSTOM').map((t) => t.value),
    requirements: pkg.requirements.map((req) => ({
      id: req.reqId,
      title: req.title,
      tags: req.tags,
      obligation: req.obligation === Obligation.SHALL ? 'shall' : 'should',
      body: req.body ?? '',
      dependsOn: req.dependsOn,
      subRequirements: req.subRequirements.map((sub) => ({
        id: sub.subId,
        title: sub.title,
        obligation: sub.obligation === Obligation.SHALL ? 'shall' : 'should',
        body: sub.body ?? '',
      })),
    })),
  }

  return (
    <PackageFormClient
      initialData={formData}
      packageId={pkg.id}
      editSlug={fullSlug}
      mode="edit"
    />
  )
}
