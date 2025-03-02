import { NextRequest } from 'next/server'
import { firstCutController } from '@/controllers/firstCutController'

export async function GET(req: NextRequest) {
  return firstCutController.getFirstCuts(req)
}

export async function DELETE(req: NextRequest) {
  return firstCutController.deleteFirstCuts(req)
} 
