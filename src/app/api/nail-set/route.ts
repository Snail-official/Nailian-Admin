import { NextRequest } from 'next/server'
import { nailSetController } from '@/controllers/nailSetController'

export async function GET(req: NextRequest) {
  return nailSetController.getNailSets(req)
}

export async function POST(req: NextRequest) {
  return nailSetController.createNailSet(req)
}