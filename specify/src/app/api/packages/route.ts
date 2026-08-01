import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { uploadYaml } from '@/lib/storage'
import { generateYaml } from '@/lib/yaml'
import { buildPackageSlug, slugify } from '@/lib/utils'
import { TagCategory, Obligation } from '@prisma/client'

const RequirementSchema = z.object({
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
        title: z.string().min(1),
        obligation: z.enum(['shall', 'should']),
        body: z.string().optional().default(''),
      })
    )
    .optional()
    .default([]),
})

const AIModelRefSchema = z.object({
  url: z.string().optional().default(''),
  name: z.string().optional().default(''),
  purpose: z.string().optional().default(''),
  modelTypes: z.array(z.string()).optional().default([]),
})

const DatasetRefSchema = z.object({
  url: z.string().optional().default(''),
  name: z.string().optional().default(''),
  purpose: z.string().optional().default(''),
})

const VendorRefSchema = z.object({
  name: z.string().optional().default(''),
  url: z.string().optional().default(''),
  purpose: z.string().optional().default(''),
})

const PackageBodySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semver (e.g. 0.1.0)'),
  license: z.string().default('MIT'),
  // Legacy tag fields (kept for backward compat)
  useCases: z.array(z.string()).optional().default([]),
  industries: z.array(z.string()).optional().default([]),
  modelTypes: z.array(z.string()).optional().default([]),
  deploymentEnvs: z.array(z.string()).optional().default([]),
  riskTier: z.string().optional().default(''),
  customTags: z.array(z.string()).optional().default([]),
  // New taxonomy
  taxonomyData: z.record(z.record(z.array(z.string()))).optional().default({}),
  // AI models, datasets, vendors
  aiModels: z.array(AIModelRefSchema).optional().default([]),
  datasetRefs: z.array(DatasetRefSchema).optional().default([]),
  vendorList: z.array(VendorRefSchema).optional().default([]),
  // Compliance
  complianceTargets: z.array(z.string()).optional().default([]),
  otherCompliance: z.string().optional().default(''),
  // Other
  requirements: z.array(RequirementSchema).optional().default([]),
  contributorIds: z.array(z.string()).optional().default([]),
  isPublished: z.boolean().optional().default(true),
  aiModelUrls: z.array(z.string()).optional().default([]),
  datasetUrls: z.array(z.string()).optional().default([]),
  isOpenSource: z.boolean().optional().default(true),
  publishedAt: z.string().optional(),
  referenceUrls: z.array(z.string()).optional().default([]),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') ?? ''
    const uc = searchParams.get('uc')?.split(',').filter(Boolean) ?? []
    const ind = searchParams.get('ind')?.split(',').filter(Boolean) ?? []
    const cert = searchParams.get('cert')?.split(',').filter(Boolean) ?? []
    const sort = (searchParams.get('sort') ?? 'recent') as 'stars' | 'forks' | 'recent' | 'downloads'
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const pageSize = 24

    const CERTIFIER_MAP: Record<string, string> = {
      'TÜV SÜD': 'TUV_SUD',
      BSI: 'BSI',
      'EU AI Office': 'EU_AI_OFFICE',
    }

    const where: Record<string, unknown> = {
      isPublished: true,
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    }

    const tagFilters = []
    if (uc.length > 0) {
      tagFilters.push({ tags: { some: { category: TagCategory.USE_CASE, value: { in: uc } } } })
    }
    if (ind.length > 0) {
      tagFilters.push({ tags: { some: { category: TagCategory.INDUSTRY, value: { in: ind } } } })
    }
    if (cert.length > 0) {
      const dbCertifiers = cert.map((c) => CERTIFIER_MAP[c]).filter(Boolean)
      if (dbCertifiers.length > 0) {
        tagFilters.push({ certifications: { some: { certifier: { in: dbCertifiers } } } })
      }
    }

    if (tagFilters.length > 0) {
      where.AND = tagFilters
    }

    const orderBy: Record<string, unknown>[] = []
    if (sort === 'stars') orderBy.push({ stars: { _count: 'desc' } })
    else if (sort === 'forks') orderBy.push({ forks: { _count: 'desc' } })
    else if (sort === 'downloads') orderBy.push({ viewCount: 'desc' })
    else orderBy.push({ createdAt: 'desc' })

    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          author: true,
          certifications: true,
          tags: true,
          _count: { select: { stars: true, forks: true, comments: true, versions: true } },
        },
      }),
      prisma.package.count({ where }),
    ])

    return NextResponse.json({ packages, total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
  } catch (err) {
    console.error('GET /api/packages error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as { id: string }).id
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true } })
    if (!user?.username) {
      return NextResponse.json({ error: 'User profile incomplete — username required' }, { status: 400 })
    }

    const body = await request.json()
    const parsed = PackageBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data
    const nameSlug = slugify(data.name)
    const slug = buildPackageSlug(user.username, nameSlug)

    // Check for slug conflict
    const existing = await prisma.package.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: `Package "${slug}" already exists` }, { status: 409 })
    }

    // Generate YAML and upload
    const yamlContent = generateYaml({
      name: data.name,
      description: data.description ?? '',
      version: data.version,
      license: data.license,
      useCases: data.useCases,
      industries: data.industries,
      modelTypes: data.modelTypes,
      deploymentEnvs: data.deploymentEnvs,
      riskTier: data.riskTier,
      customTags: data.customTags,
      requirements: data.requirements.map((r) => ({
        ...r,
        obligation: r.obligation as 'shall' | 'should',
        subRequirements: r.subRequirements.map((s) => ({
          ...s,
          obligation: s.obligation as 'shall' | 'should',
        })),
      })),
    })

    let yamlUrl: string | undefined
    try {
      yamlUrl = await uploadYaml(slug, data.version, yamlContent)
    } catch {
      // Continue without storage if it's not configured
      yamlUrl = undefined
    }

    // Build tag records
    const tagRecords: Array<{ category: TagCategory; value: string }> = []
    for (const v of data.useCases) tagRecords.push({ category: TagCategory.USE_CASE, value: v })
    for (const v of data.industries) tagRecords.push({ category: TagCategory.INDUSTRY, value: v })
    for (const v of data.modelTypes) tagRecords.push({ category: TagCategory.MODEL_TYPE, value: v })
    for (const v of data.deploymentEnvs) tagRecords.push({ category: TagCategory.DEPLOYMENT_ENV, value: v })
    if (data.riskTier) tagRecords.push({ category: TagCategory.RISK_TIER, value: data.riskTier })
    for (const v of data.customTags) tagRecords.push({ category: TagCategory.CUSTOM, value: v })

    const pkg = await prisma.package.create({
      data: {
        slug,
        authorId: user.id,
        name: data.name,
        description: data.description,
        license: data.license,
        specifyVersion: '0.1',
        yamlUrl,
        currentVersion: data.version,
        isPublished: data.isPublished,
        aiModelUrls: data.aiModelUrls,
        datasetUrls: data.datasetUrls,
        aiModels: data.aiModels,
        datasetRefs: data.datasetRefs,
        vendorList: data.vendorList,
        taxonomyData: data.taxonomyData,
        complianceTargets: data.complianceTargets,
        otherCompliance: data.otherCompliance || null,
        isOpenSource: data.isOpenSource,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : (data.isPublished ? new Date() : null),
        referenceUrls: data.referenceUrls,
        tags: { createMany: { data: tagRecords } },
        requirements: {
          create: data.requirements.map((req, order) => ({
            reqId: req.id,
            title: req.title,
            tags: req.tags,
            obligation: req.obligation.toUpperCase() as Obligation,
            body: req.body,
            dependsOn: req.dependsOn,
            order,
            subRequirements: {
              create: req.subRequirements.map((sub, subOrder) => ({
                subId: sub.id,
                title: sub.title,
                obligation: sub.obligation.toUpperCase() as Obligation,
                body: sub.body,
                order: subOrder,
              })),
            },
          })),
        },
      },
      include: {
        author: true,
        requirements: { include: { subRequirements: true } },
        certifications: true,
        tags: true,
      },
    })

    // Add contributors
    if (data.contributorIds.length > 0) {
      await prisma.packageContributor.createMany({
        data: data.contributorIds.map((userId) => ({
          packageId: pkg.id,
          userId,
          role: 'contributor',
        })),
        skipDuplicates: true,
      })
    }

    // Store version record
    if (yamlUrl) {
      await prisma.packageVersion.create({
        data: {
          packageId: pkg.id,
          version: data.version,
          yamlUrl,
          publishedById: user.id,
        },
      })
    }

    return NextResponse.json(pkg, { status: 201 })
  } catch (err) {
    console.error('POST /api/packages error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
