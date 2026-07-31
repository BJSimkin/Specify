import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { uploadYaml, deleteYaml } from '@/lib/storage'
import { generateYaml } from '@/lib/yaml'
import { TagCategory, Obligation } from '@prisma/client'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pkg = await prisma.package.findUnique({
      where: { id: params.id },
      include: {
        author: true,
        requirements: {
          orderBy: { order: 'asc' },
          include: {
            subRequirements: { orderBy: { order: 'asc' } },
            comments: { include: { author: true }, orderBy: { createdAt: 'asc' } },
          },
        },
        certifications: { include: { grantedBy: true } },
        tags: true,
        versions: { orderBy: { publishedAt: 'desc' }, include: { publishedBy: true } },
        forkedFrom: { include: { author: true } },
        forks: { include: { author: true } },
        _count: { select: { stars: true, forks: true, comments: true } },
      },
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    // Increment view count asynchronously
    prisma.package.update({ where: { id: pkg.id }, data: { viewCount: { increment: 1 } } }).catch(() => {})

    return NextResponse.json(pkg)
  } catch (err) {
    console.error('GET /api/packages/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const UpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  license: z.string().optional(),
  // Legacy
  useCases: z.array(z.string()).optional(),
  industries: z.array(z.string()).optional(),
  modelTypes: z.array(z.string()).optional(),
  deploymentEnvs: z.array(z.string()).optional(),
  riskTier: z.string().optional(),
  customTags: z.array(z.string()).optional(),
  // New taxonomy & structured data
  taxonomyData: z.record(z.record(z.array(z.string()))).optional(),
  aiModels: z.array(z.object({
    url: z.string().optional().default(''),
    name: z.string().optional().default(''),
    purpose: z.string().optional().default(''),
    modelTypes: z.array(z.string()).optional().default([]),
  })).optional(),
  datasetRefs: z.array(z.object({
    url: z.string().optional().default(''),
    name: z.string().optional().default(''),
    purpose: z.string().optional().default(''),
  })).optional(),
  vendorList: z.array(z.object({
    name: z.string().optional().default(''),
    url: z.string().optional().default(''),
    purpose: z.string().optional().default(''),
  })).optional(),
  complianceTargets: z.array(z.string()).optional(),
  otherCompliance: z.string().optional(),
  isOpenSource: z.boolean().optional(),
  publishedAt: z.string().optional(),
  requirements: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        tags: z.array(z.string()),
        obligation: z.enum(['shall', 'should']),
        body: z.string().optional().default(''),
        dependsOn: z.array(z.string()).optional().default([]),
        subRequirements: z
          .array(
            z.object({
              id: z.string(),
              title: z.string(),
              obligation: z.enum(['shall', 'should']),
              body: z.string().optional().default(''),
            })
          )
          .optional()
          .default([]),
      })
    )
    .optional(),
  isPublished: z.boolean().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as { id: string }).id

    const pkg = await prisma.package.findUnique({
      where: { id: params.id },
      select: { id: true, authorId: true, slug: true, yamlUrl: true, currentVersion: true },
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    if (pkg.authorId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data
    const newVersion = data.version ?? pkg.currentVersion

    // Regenerate YAML if requirements changed
    let yamlUrl = pkg.yamlUrl
    if (data.requirements !== undefined) {
      try {
        const yamlContent = generateYaml({
          name: data.name ?? '',
          description: data.description ?? '',
          version: newVersion,
          license: data.license ?? 'MIT',
          useCases: data.useCases ?? [],
          industries: data.industries ?? [],
          modelTypes: data.modelTypes ?? [],
          deploymentEnvs: data.deploymentEnvs ?? [],
          riskTier: data.riskTier ?? '',
          customTags: data.customTags ?? [],
          requirements: (data.requirements ?? []).map((r) => ({
            ...r,
            obligation: r.obligation as 'shall' | 'should',
            subRequirements: (r.subRequirements ?? []).map((s) => ({
              ...s,
              obligation: s.obligation as 'shall' | 'should',
            })),
          })),
        })

        if (pkg.yamlUrl) {
          try { await deleteYaml(pkg.yamlUrl) } catch {}
        }
        yamlUrl = await uploadYaml(pkg.slug, newVersion, yamlContent)
      } catch {
        // Continue without storage
      }
    }

    // Update tags
    if (
      data.useCases !== undefined ||
      data.industries !== undefined ||
      data.modelTypes !== undefined ||
      data.deploymentEnvs !== undefined ||
      data.riskTier !== undefined ||
      data.customTags !== undefined
    ) {
      await prisma.tag.deleteMany({ where: { packageId: pkg.id } })
      const tagRecords: Array<{ category: TagCategory; value: string }> = []
      for (const v of data.useCases ?? []) tagRecords.push({ category: TagCategory.USE_CASE, value: v })
      for (const v of data.industries ?? []) tagRecords.push({ category: TagCategory.INDUSTRY, value: v })
      for (const v of data.modelTypes ?? []) tagRecords.push({ category: TagCategory.MODEL_TYPE, value: v })
      for (const v of data.deploymentEnvs ?? []) tagRecords.push({ category: TagCategory.DEPLOYMENT_ENV, value: v })
      if (data.riskTier) tagRecords.push({ category: TagCategory.RISK_TIER, value: data.riskTier })
      for (const v of data.customTags ?? []) tagRecords.push({ category: TagCategory.CUSTOM, value: v })
      if (tagRecords.length > 0) {
        await prisma.tag.createMany({ data: tagRecords.map((t) => ({ ...t, packageId: pkg.id })) })
      }
    }

    // Update requirements
    if (data.requirements !== undefined) {
      await prisma.requirement.deleteMany({ where: { packageId: pkg.id } })
      for (let i = 0; i < data.requirements.length; i++) {
        const req = data.requirements[i]
        const created = await prisma.requirement.create({
          data: {
            packageId: pkg.id,
            reqId: req.id,
            title: req.title,
            tags: req.tags,
            obligation: req.obligation.toUpperCase() as Obligation,
            body: req.body,
            dependsOn: req.dependsOn ?? [],
            order: i,
          },
        })
        if (req.subRequirements && req.subRequirements.length > 0) {
          await prisma.subRequirement.createMany({
            data: req.subRequirements.map((sub, j) => ({
              requirementId: created.id,
              subId: sub.id,
              title: sub.title,
              obligation: sub.obligation.toUpperCase() as Obligation,
              body: sub.body,
              order: j,
            })),
          })
        }
      }
    }

    const updated = await prisma.package.update({
      where: { id: pkg.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.license !== undefined && { license: data.license }),
        ...(data.version !== undefined && { currentVersion: data.version }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
        ...(data.taxonomyData !== undefined && { taxonomyData: data.taxonomyData }),
        ...(data.aiModels !== undefined && { aiModels: data.aiModels }),
        ...(data.datasetRefs !== undefined && { datasetRefs: data.datasetRefs }),
        ...(data.vendorList !== undefined && { vendorList: data.vendorList }),
        ...(data.complianceTargets !== undefined && { complianceTargets: data.complianceTargets }),
        ...(data.otherCompliance !== undefined && { otherCompliance: data.otherCompliance || null }),
        ...(data.isOpenSource !== undefined && { isOpenSource: data.isOpenSource }),
        ...(data.publishedAt !== undefined && { publishedAt: data.publishedAt ? new Date(data.publishedAt) : null }),
        ...(yamlUrl !== pkg.yamlUrl && { yamlUrl }),
      },
      include: {
        author: true,
        requirements: { orderBy: { order: 'asc' }, include: { subRequirements: { orderBy: { order: 'asc' } } } },
        certifications: true,
        tags: true,
        _count: { select: { stars: true, forks: true, comments: true } },
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('PUT /api/packages/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as { id: string }).id

    const pkg = await prisma.package.findUnique({
      where: { id: params.id },
      select: { id: true, authorId: true, yamlUrl: true },
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    if (pkg.authorId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (pkg.yamlUrl) {
      try { await deleteYaml(pkg.yamlUrl) } catch {}
    }

    await prisma.package.delete({ where: { id: pkg.id } })

    return NextResponse.json({ deleted: true })
  } catch (err) {
    console.error('DELETE /api/packages/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
