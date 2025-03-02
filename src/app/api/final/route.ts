import { NextRequest } from 'next/server'
import { finalController } from '@/controllers/finalController'

// GET /api/final
export async function GET(req: NextRequest) {
  return finalController.getFinals(req)
}