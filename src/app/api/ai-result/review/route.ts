import { NextRequest } from 'next/server'
import { aiResultController } from '@/server/controllers/aiResultController'

export async function POST(req: NextRequest) {
  return aiResultController.reviewAiResults(req)
} 