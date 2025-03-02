import { NextRequest } from 'next/server'
import { nailSetController } from '@/server/controllers/nailSetController'

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return nailSetController.getNailSetById(req, context)
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return nailSetController.updateNailSet(req, context)
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return nailSetController.deleteNailSet(req, context)
} 