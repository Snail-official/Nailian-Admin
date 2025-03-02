import { NextRequest } from 'next/server'
import { finalController } from '@/controllers/finalController'

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return finalController.recoverFinal(req, context)
} 