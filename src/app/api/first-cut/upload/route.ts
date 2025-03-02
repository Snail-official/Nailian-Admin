import { NextRequest } from 'next/server'
import { firstCutController } from '@/server/controllers/firstCutController'

export async function POST(req: NextRequest) {
  return firstCutController.uploadFirstCuts(req)
} 