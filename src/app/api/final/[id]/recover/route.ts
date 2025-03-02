import { NextRequest } from 'next/server'
import { finalController } from '@/server/controllers/finalController'

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return finalController.recoverFinal(req, context)
} 