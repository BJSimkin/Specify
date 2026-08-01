import { prisma } from '@/lib/prisma'
import CardsClient from './cards-client'

export default async function CardsPage() {
  // Fetch download counts for all card types
  const records = await prisma.cardTemplate.findMany()
  const counts: Record<string, number> = {}
  for (const r of records) counts[r.id] = r.downloadCount

  return <CardsClient initialCounts={counts} />
}
