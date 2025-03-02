import { NextRequest } from 'next/server'
import { aiResultController } from '@/controllers/aiResultController'

export async function POST(req: NextRequest) {
  return aiResultController.reviewAiResults(req)
} 