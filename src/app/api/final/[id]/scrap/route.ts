import { NextRequest } from 'next/server'
import { finalController } from '@/controllers/finalController'

// POST /api/final/:id/scrap
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return finalController.toggleScrap(req, context)
}