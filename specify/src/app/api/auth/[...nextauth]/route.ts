import { type NextRequest } from "next/server"
import { handlers } from "@/lib/auth"
export async function GET(
  request: NextRequest,
  context: { params: { nextauth: string[] } }
) {
  return handlers.GET(request)
}
export async function POST(
  request: NextRequest,
  context: { params: { nextauth: string[] } }
) {
  return handlers.POST(request)
}
