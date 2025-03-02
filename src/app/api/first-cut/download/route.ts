import { NextRequest } from 'next/server'
import { firstCutController } from '@/controllers/firstCutController'

export async function POST(req: NextRequest) {
  return firstCutController.downloadFirstCuts(req)
} 